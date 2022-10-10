const { Client, Databases } = require("node-appwrite");

const ENDPOINT = 'http://localhost/v1';
const PROJECT = 'offline';

const obj = {
  client: null,
  databases: null,
};

const getAppwriteConn = ( endpoint = null,  project = null) => {
  if (!obj.client) obj.client = new Client();
  if (!obj.databases) obj.databases = new Databases(obj.client);

  obj.client.setEndpoint(endpoint || ENDPOINT).setProject(project || PROJECT);

  return obj;
};
module.exports = getAppwriteConn;