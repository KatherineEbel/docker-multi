import keys from './keys';
import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import {createClient, RedisClientType, RedisDefaultModules, RedisFunctions, RedisModules, RedisScripts} from 'redis';


let sub: RedisClientType<RedisDefaultModules & RedisModules, RedisFunctions, RedisScripts>;
const app = express();
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors());
app.use(express.json());

const pgPool = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});



const redisClient = createClient({
  socket: {
    host: keys.redisHost,
    port: keys.redisPort,
    reconnectStrategy: () => 1000,
  },
});

void (async () => {
  sub = redisClient.duplicate();
  try {
    await redisClient.connect();
    await pgPool.query('CREATE TABLE IF NOT EXISTS values (number INT)');
    await sub.connect();
  } catch (e) {
    console.log(e);
  }
})();

app.get('/', (_req, res) => {
  res.send('Hi');
});

app.get('/values/all', async (_req, res) => {
  try {
    const values = await pgPool.query('SELECT * from values');
    res.send(values.rows);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.get('/values/current', async (_req, res) => {
  try {
    const values = await redisClient.hGetAll('values');
    res.send({ values });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

interface TypedRequestBody<T> extends Express.Request {
  body: T
}

app.post('/values', async (req: TypedRequestBody<{index: string}>, res) => {
  const {index} = req.body;
  if (parseInt(index) > 40) {
    res.status(422).json({error: 'I can only calculate indexes up to 40'});
    return;
  }
  try {
    await redisClient.hSet('values', index, 'Nothing yet');
    await sub.publish('insert', index);
    await pgPool.query('INSERT INTO values(number) VALUES($1)', [index]);
    res.json({error: false});
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

const port = 4000;
app.listen(port, () => console.log(`Express listening on port ${port}`));