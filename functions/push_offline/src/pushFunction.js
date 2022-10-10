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
  const ids = documents.map((doc) => doc.___meta.documentId);
  const idsOnDatabase = await ResProm(
    databases.listDocuments('teste', 'col_teste', [Query.equal('$id', ids)])
  );
  console.log(idsOnDatabase)
  documents.forEach(async (document) => {
    const getDocument = databases.getDocument(
      databaseId,
      collectionId,
      document.___meta.documentId
    );
    const promise = databases.createDocument(
      databaseId,
      collectionId,
      document.___meta.documentId,
      documents
    );
    await ResProm(promise);
  });
}
module.exports = pushFunction;
