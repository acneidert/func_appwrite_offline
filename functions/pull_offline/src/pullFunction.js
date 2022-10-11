const { Query } = require('node-appwrite');

const ResProm = async (promise) => {
  return await new Promise((resolve, reject) => {
    promise.then(
      (response) => resolve(response),
      (error) => reject(error)
    );
  });
};

async function pullFunction(databases, databaseId, collectionId, last_sync) {
  const promise = databases.listDocuments(databaseId, collectionId, [
    Query.greaterThan('$updatedAt', last_sync),
  ]);
  return await ResProm(promise);
}
module.exports = pullFunction;
