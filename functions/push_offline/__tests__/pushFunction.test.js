const pushFunction = require('../src/pushFunction');
const getAppwriteConn = require('./__utils__/AppwriteConn');

describe('Test pushFunction', () => {
  test('It push data', async () => {
    const {databases} = getAppwriteConn()
    pushFunction(databases, {
      databaseId: 'offline', 
      collectionId: 'col_teste', 
      documents: []
    });
  });
});

