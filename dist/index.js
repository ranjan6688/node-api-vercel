"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { DbService } from './dbSvc';
const dvSvcs_1 = require("./dvSvcs");
// var db = new JsonDB(new Config(path.join(process.cwd(), 'db.json'), true, false, '/'));
// var dbSvc = new DbService();
var dbSvc = new dvSvcs_1.DbSvc();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.get('/', (_req, res) => {
    return res.send('Express Typescript on Vercel');
});
app.get('/add', async (_req, res) => {
    //   return res.send(await dbSvc.addUser());
    var db = await dbSvc.initDB();
    db.dump().then((data) => {
        return res.send(data);
    }).catch((err) => {
        return res.send(err);
        ;
    });
});
app.get('/update', async (_req, res) => {
    return res.send(404);
});
app.get('/fetch', async (_req, res) => {
    return res.send(404);
});
app.get('/ping', (_req, res) => {
    return res.send('pong 🏓');
});
app.get('/posts', async (_req, res) => {
    // return res.send(await db.getData("/posts"));  
});
app.get('/comments', async (_req, res) => {
    // var data = await db.getData("/comments");
    // return res.send(JSON.stringify(data))
    //   return res.send('hello')
    //   return res.send(await db.getData("/comments"));  
});
app.get('/profile', async (_req, res) => {
    // var data = await db.getData("/profile");
    //   return res.send('hello')
    //   return res.send(await db.getData("/profile"));  
});
app.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
});
// module.exports = app;
//# sourceMappingURL=index.js.map