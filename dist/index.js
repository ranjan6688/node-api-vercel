"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_json_db_1 = require("node-json-db");
const path_1 = __importDefault(require("path"));
var db = new node_json_db_1.JsonDB(new node_json_db_1.Config(path_1.default.join(process.cwd(), 'db.json'), true, false, '/'));
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.get('/', (_req, res) => {
    return res.send('Express Typescript on Vercel');
});
app.get('/ping', (_req, res) => {
    return res.send('pong 🏓');
});
app.get('/posts', async (_req, res) => {
    db.getData("/posts").then((val) => {
        return res.send(JSON.stringify(val));
    }).catch((err) => {
        return res.send(JSON.stringify(err));
    });
});
app.get('/comments', async (_req, res) => {
    // var data = await db.getData("/comments");
    // return res.send(JSON.stringify(data))
    return res.send('hello');
});
app.get('/profile', (_req, res) => {
    // var data = await db.getData("/profile");
    return res.send('hello');
});
app.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
});
// module.exports = app;
//# sourceMappingURL=index.js.map