import { createRxDatabase, addRxPlugin } from "rxdb";
const levelDown = require("leveldown");
require('colors');

export class DbSvc{

    constructor(){
        addRxPlugin(require('pouchdb-adapter-leveldb'));
    }

    async initDB(){
        try{

            const db = await createRxDatabase({
                name: 'tutorial',
                adapter: levelDown
            }).then((db) => {
                console.log('db created');
                return db;
            });

            db.dump().then(console.log);
            return db;
        }catch(ex){
            console.error(ex);
            return ex;
        }
    }
}