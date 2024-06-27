"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbSvc = void 0;
const rxdb_1 = require("rxdb");
const levelDown = require("leveldown");
require('colors');
class DbSvc {
    constructor() {
        (0, rxdb_1.addRxPlugin)(require('pouchdb-adapter-leveldb'));
    }
    async initDB() {
        try {
            const db = await (0, rxdb_1.createRxDatabase)({
                name: 'tutorial',
                adapter: levelDown
            }).then((db) => {
                console.log('db created');
                return db;
            });
            db.dump().then(console.log);
            return db;
        }
        catch (ex) {
            console.error(ex);
            return ex;
        }
    }
}
exports.DbSvc = DbSvc;
//# sourceMappingURL=dvSvcs.js.map