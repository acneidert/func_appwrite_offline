const { Databases, Query } = require('node-appwrite');

const ResProm = async (promise) => {
  return await new Promise((resolve, reject) => {
    promise.then(
      (response) => resolve(response),
      (error) => reject(error)
    );
  });
};

/**
 *
 * @param {Databases} database
 * @param {{
 *  databaseId: string
 *  collectionId: string
 *  documents: {
 *
 * }
 * }} data
 */
async function pushFunction(databases, data) {
  const { databaseId, collectionId, documents } = data;
  const response = {
    synced: [],
    unsynced: [],
  };
  const ids = documents.map((doc) => doc.___meta.documentId);
  const idsOnDatabase = (
    await ResProm(
      databases.listDocuments('teste', 'col_teste', [Query.equal('$id', ids)])
    )
  ).documents.map((doc) => doc.$id);
  for(const document of documents) {
    const id = document.___meta.documentId;
    if (idsOnDatabase.includes(id)) {
      try {
        delete document.___meta;
        await ResProm(
          databases.updateDocument(databaseId, collectionId, id, document)
        );
        response.synced.push(id);
      } catch (error) {
        response.unsynced.push(id);
      }
    } else {
      try {
        delete document.___meta;
        await ResProm(
          databases.createDocument(databaseId, collectionId, id, document)
        );
        response.synced.push(id);
      } catch (error) {
        response.unsynced.push(id);
      }
    }
  };

  return response;
}
module.exports = pushFunction;
