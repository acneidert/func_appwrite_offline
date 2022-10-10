/**
 * 
 * @param {string} database 
 * @param {string} collection 
 * @param {string} id 
 * @param {objetct} data 
 * @returns {object}
 */
function DocumentBase(database, collection, id, data) {
  return {
    ...data,
    $id: id,
    $permissions: [
      'read("user:00000000000000000000")',
      'update("user:00000000000000000000")',
      'delete("user:00000000000000000000")',
    ],
    $createdAt: new Date(0, 0, 0).toISOString(),
    $updatedAt: new Date(0, 0, 0).toISOString(),
    $collectionId: collection,
    $databaseId: database,
    ___meta: {
      documentId: id,
      ___deleted: false,
      ___created: new Date().toISOString(),
      ___synced: false,
    },
  };
}

module.exports.DocumentBase = DocumentBase;
