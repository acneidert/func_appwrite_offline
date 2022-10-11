const { Client: AppClient } = require('node-appwrite');
const { Query } = require('node-appwrite');
const { Permission } = require('node-appwrite');
const { Role } = require('node-appwrite');
const { ID } = require('node-appwrite');
const { InputFile } = require('node-appwrite');
const { AppwriteException } = require('node-appwrite');
const { Account } = require('node-appwrite');
const { Avatars } = require('node-appwrite');
const { Databases } = require('node-appwrite');
const { Functions } = require('node-appwrite');
const { Health } = require('node-appwrite');
const { Locale } = require('node-appwrite');
const { Storage } = require('node-appwrite');
const { Teams } = require('node-appwrite');
const { Users } = require('node-appwrite');
const { MemoryDb } = require('../__tests__/__utils__/MemoryDb');
function randomInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}
class Client extends AppClient {
    offline = false;
    async call(method, url, headers= {}, params = {}) {
      const db = MemoryDb;
      const arrayUrl = url.split('/')
      console.log('Mocked Pull')
      // create Document
      if(method === 'post') {
        if(params.documentId === 'this_is_a_error') throw new AppwriteException('error_ok')
        const collection = arrayUrl[arrayUrl.length - 2]
        const database = arrayUrl[arrayUrl.length - 4]
        return db.add(params.documentId, {
          ...params.data,
          '$id': params.documentId,
          '$permissions': [
            'read("user:00000000000000000000")',
            'update("user:00000000000000000000")',
            'delete("user:00000000000000000000")'
          ],
          '$createdAt': new Date(0,0,0).toISOString(),
          '$updatedAt': new Date(2022,9, randomInterval(5,11) ).toISOString(),
          '$collectionId': collection,
          '$databaseId': database
        });
      }
  
      // List Documents
      if(method === 'get' && arrayUrl[arrayUrl.length - 1] === 'documents'){
        return db.listAll(params.queries || null)
      }
  
      // Get Document
      if(method === 'get' && arrayUrl[arrayUrl.length - 1] !== 'documents') {
        return db.getById(arrayUrl[arrayUrl.length - 1])
      }
  
      // Update Document
      if(method === 'patch') {
        return db.update(arrayUrl[arrayUrl.length - 1], params.data)
      }
  
      // Delete Document
      if(method === 'delete') {
        return db.delete(params.documentId)
      }
  
      throw new Error('Error on Procediment')
    
    }
  }

module.exports = {
    Client,
    Query,
    Permission,
    Role,
    ID,
    InputFile,
    AppwriteException,
    Account,
    Avatars,
    Databases,
    Functions,
    Health,
    Locale,
    Storage,
    Teams,
    Users,
}