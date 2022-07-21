const { REDIS_HOST, REDIS_PORT, PGUSER, PGHOST, PGDATABASE, PGPASSWORD, PGPORT} = process.env;

if ([PGUSER, PGHOST, PGDATABASE, PGPASSWORD, PGPORT, REDIS_PORT, REDIS_HOST].some(v => !v)) throw new Error('environment not configured');

const keys = {
  redisHost: REDIS_HOST,
  redisPort: parseInt(REDIS_PORT || '6379'),
  pgUser: PGUSER,
  pgHost: PGHOST,
  pgDatabase: PGDATABASE,
  pgPassword: PGPASSWORD,
  pgPort: parseInt(PGPORT || '5432'),
};

export default keys;