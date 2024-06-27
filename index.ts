import express, { Request, Response } from 'express'
import { Config, JsonDB } from 'node-json-db';
import path from 'path';

var db = new JsonDB(new Config(path.join(process.cwd(), 'db.json'), true, false, '/'));

const app = express()
const port = process.env.PORT || 8080

app.get('/', (_req: Request, res: Response) => {
  return res.send('Express Typescript on Vercel')
})

app.get('/ping', (_req: Request, res: Response) => {
  return res.send('pong 🏓')
})

app.get('/posts', async (_req: Request, res: Response) => {
  db.getData("/posts").then((val: any) => {
    return res.send(JSON.stringify(val));
  }).catch((err: any) => {
    return res.send(JSON.stringify(err));
  });
  
})

app.get('/comments', async (_req: Request, res: Response) => {
  // var data = await db.getData("/comments");
  // return res.send(JSON.stringify(data))
  return res.send('hello')
})

app.get('/profile', (_req: Request, res: Response) => {
  // var data = await db.getData("/profile");
  return res.send('hello')
})

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`)
})

// module.exports = app;