const pushFunction = require('../src/pushFunction');
const getAppwriteConn = require('./__utils__/AppwriteConn');
const { DocumentBase } = require('./__utils__/DocumentBase');
const { ResProm } = require('./__utils__/ResProm');
const { MemoryDb } = require('../__tests__/__utils__/MemoryDb');
const DOCS = {
  INS: [],
  N_INS: [],
};
// Create documents
beforeAll(async () => {
  // Insert Some Elements
  const { databases } = getAppwriteConn();
  for (let i = 0; i < 10; i++) {
    const changeAt_ = new Date().toISOString();
    if (i % 2 === 0) {
      const promise = databases.createDocument(
        'teste',
        'col_teste',
        'inserted_0' + i,
        {
          nome: 'Teste ' + i,
          obs: 'Teste Obs',
          changeAt_,
        }
      );
      DOCS.INS.push(await ResProm(promise));
      if (i === 4)
        DOCS.N_INS.push(
          DocumentBase('teste', 'col_teste', 'inserted_0' + i, {
            nome: 'Teste ' + i,
            obs: 'Teste Alterado',
            changeAt_,
          })
        );
    } else {
      DOCS.N_INS.push(
        DocumentBase('teste', 'col_teste', 'non_inserted_0' + i, {
          nome: 'Teste ' + i,
          obs: 'Teste Obs',
          changeAt_,
        })
      );
    }
  }
});

afterAll(async () => {
  // Clean database
  MemoryDb.resetDatabase();
});

describe('Test pushFunction', () => {
  test('It push data', async () => {
    const { databases } = getAppwriteConn();
    const ret = await pushFunction(databases, {
      databaseId: 'offline',
      collectionId: 'col_teste',
      documents: DOCS.N_INS,
    });
    expect(ret).toHaveProperty('synced', [
      'non_inserted_01',
      'non_inserted_03',
      'inserted_04',
      'non_inserted_05',
      'non_inserted_07',
      'non_inserted_09',
    ]);
  });

  test('unsync must be not empty', async () => {
    const { databases } = getAppwriteConn();
    const ret = await pushFunction(databases, {
      databaseId: 'offline',
      collectionId: 'col_teste',
      documents: [
        DocumentBase('offline', 'col_teste', 'this_is_a_error', {
          name: 'This is a Error',
          obs: 'Teste Obs',
          changeAt_: new Date().toISOString(),
        }),
      ],
    });
    expect(ret).toHaveProperty('unsynced', ['this_is_a_error']);
  });
});
