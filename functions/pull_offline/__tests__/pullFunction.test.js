const getAppwriteConn = require('./__utils__/AppwriteConn');
const { DocumentBase } = require('./__utils__/DocumentBase');
const { ResProm } = require('./__utils__/ResProm');
const { MemoryDb } = require('../__tests__/__utils__/MemoryDb');
const pullFunction = require('../src/pullFunction');

const DOCS = {
  INS: [],
  N_INS: [],
};
// Create documents
beforeAll(async () => {
  // Insert Some Elements
  const { databases } = getAppwriteConn();
  for (let i = 0; i < 100; i++) {
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

describe('Test pullFunction', () => {
    test('It pull data', async () => {
      const { databases } = getAppwriteConn();
      const allGt = await pullFunction(databases, 'teste', 'col_teste', new Date(2022, 9, 10).toISOString());
      expect(allGt.documents.length).toBeGreaterThan(0);
    });
  });
  