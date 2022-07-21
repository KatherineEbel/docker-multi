import keys from './keys';
import { createClient } from 'redis';


const redisClient = createClient({
  socket: {
    host: keys.redisHost,
    port: keys.redisPort,
    reconnectStrategy: () => 1000,
  },
});

void (async () => {

  await redisClient.connect();

  const sub = redisClient.duplicate();
  await sub.connect();

  await sub.subscribe('insert', (message) => {
    const value = fib(parseInt(message), {});
    console.log('calculated value', value);
    redisClient.hSet('values', message, value)
      .catch(e => console.log(e));
  });
})();

function fib(index: number, memo: Record<number, number>): number {
  if (index < 2) return 1;
  if (memo[index] === undefined) {
    memo[index] = fib(index - 2, memo) + fib(index - 1, memo);
  }
  return memo[index];
}

