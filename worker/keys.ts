const { REDIS_HOST, REDIS_PORT } = process.env;
if (!REDIS_HOST || !REDIS_PORT) throw new Error('environment not configured');

export default {
  redisHost: REDIS_HOST,
  redisPort: parseInt(REDIS_PORT),
};
