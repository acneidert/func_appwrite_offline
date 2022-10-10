/**
 * The MemoryDb class defines the `getInstance` method that lets clients access
 * the unique MemoryDb instance.
 */
 class MemoryDb {
    static instance;
    data = {};
    /**
     * The MemoryDb's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    constructor() { }

    /**
     * The static method that controls the access to the MemoryDb instance.
     *
     * This implementation let you subclass the MemoryDb class while keeping
     * just one instance of each subclass around.
     */
    static getInstance() {
        if (!MemoryDb.instance) {
            MemoryDb.instance = new MemoryDb();
        }

        return MemoryDb.instance;
    }

    add(id, data) {
        this.data[id] = {...data, '$__from': 'database'}
        return this.data[id] 
    }

    getById(id) {
        return this.data[id]
    }

    listAll() {
        return {
            total: Object.values(this.data).length, 
            documents: Object.values(this.data),
        };
    }

    update(id, data) {
        this.data[id] = {
            ...this.data[id],
            ...data
        }
        return this.data[id]
    }

    delete(id) {
        delete this.data[id];
    }
}

const memoryDbInstance = new MemoryDb();

Object.freeze(memoryDbInstance);

module.exports = {
    MemoryDb: memoryDbInstance
}
