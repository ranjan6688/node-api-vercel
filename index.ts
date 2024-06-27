import express, { Request, Response } from 'express'
import { Config, JsonDB } from 'node-json-db';
import path from 'path';
import { DbService } from './dbSvc';

var db = new JsonDB(new Config(path.join(process.cwd(), 'db.json'), true, false, '/'));
var dbSvc = new DbService();

const app = express()
const port = process.env.PORT || 8080

app.get('/', (_req: Request, res: Response) => {
  return res.send('Express Typescript on Vercel')
})

app.get('/add', async (_req: Request, res: Response) => {
  return res.send(await dbSvc.addUser());
})

app.get('/update', async (_req: Request, res: Response) => {
    return res.send(404);
})

app.get('/fetch', async (_req: Request, res: Response) => {
    return res.send(404);
})

app.get('/ping', (_req: Request, res: Response) => {
  return res.send('pong 🏓')
})

app.get('/posts', async (_req: Request, res: Response) => {
    return res.send(await db.getData("/posts"));  
})

app.get('/comments', async (_req: Request, res: Response) => {
  // var data = await db.getData("/comments");
  // return res.send(JSON.stringify(data))
//   return res.send('hello')
  return res.send(await db.getData("/comments"));  
})

app.get('/profile', async (_req: Request, res: Response) => {
  // var data = await db.getData("/profile");
//   return res.send('hello')
  return res.send(await db.getData("/profile"));  
})

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`)
})

// module.exports = app;