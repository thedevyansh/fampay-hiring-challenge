import redis, { createClient } from 'redis';
import rejson from 'redis-rejson';
import redisearch from 'redis-redisearch';
import { promisify } from 'util';
import 'dotenv/config.js';

rejson(redis);
redisearch(redis);

redis.addCommand('ft.aggregate');

const redisClient = createClient({
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  port: parseInt(process.env.REDIS_PORT),
});

const ftcreateAsync = promisify(redisClient.ft_create).bind(redisClient);
const ftInfoAsync = promisify(redisClient.ft_info).bind(redisClient);
const keysAsync = promisify(redisClient.keys).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

export const roomsIndex = 'roomsIndex';

redisClient.on('ready', async () => {
  console.log(`Connected to Redis on ${process.env.REDIS_HOST}.`);
});

redisClient.on('error', err => {
  console.error(err);
});

export default redisClient;
