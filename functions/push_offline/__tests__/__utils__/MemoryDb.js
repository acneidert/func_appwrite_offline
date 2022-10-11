const operators = {
  equal: (attribute, value) => (doc) => {
    if (value instanceof Array) return value.includes(doc[attribute]);
    return doc[attribute] === value;
  },
  greaterThan: (attribute, value) => (doc) => {
    // "$updatedAt", ["2022-10-01T03:00:00.000Z"])
    const date = new Date(doc[attribute]);
    if (value instanceof Array) return date > new Date(value[0]);
    return date > new Date(value);
  } 
};

class MemoryDb {
  static instance;
  data = {};

  constructor() {}

  static getInstance() {
    if (!MemoryDb.instance) {
      MemoryDb.instance = new MemoryDb();
    }

    return MemoryDb.instance;
  }

  add(id, data) {
    this.data[id] = { ...data, $__from: 'database' };
    return this.data[id];
  }

  getById(id) {
    return this.data[id];
  }

  listAll(queries = null) {
    const filters = [];
    if (queries) {
      for (const qry of queries) {
        filters.push(this._parseQuery(qry));
      }
    }
    function filter(doc) {
      if (filters.length > 0) {
        for (const filt of filters) {
          if (!filt(doc)) return false;
        }
      }
      return true;
    }
    return {
      total: Object.values(this.data).filter(filter).length,
      documents: Object.values(this.data).filter(filter),
    };
  }

  _parseQuery(query) {
    const rgxMethod = /(.*?)(?=\()/g;
    const rgxValues = /(?<=\[)(.*?)(?=\])/g;
    const rgxAttribute = /(?<=\(")(.*?)(?=\")/g;
    const method = (query.match(rgxMethod) || [''])[0];
    const values = (query.match(rgxValues) || [''])[0]
      .split(',')
      .map((qry) => qry.replaceAll('"', ''));
    const attribute = (query.match(rgxAttribute) || [''])[0];
    return operators[method](attribute, values);
  }

  update(id, data) {
    this.data[id] = {
      ...this.data[id],
      ...data,
    };
    return this.data[id];
  }

  delete(id) {
    delete this.data[id];
  }
  resetDatabase() {
    Object.keys(this.data).map( key => {
      this.delete(key)
    })
  }
}

const memoryDbInstance = new MemoryDb();

Object.freeze(memoryDbInstance);

module.exports = {
  MemoryDb: memoryDbInstance,
};
