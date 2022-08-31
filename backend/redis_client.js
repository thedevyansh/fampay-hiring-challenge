import redis, { createClient } from 'redis';
import rejson from 'redis-rejson';
import { promisify } from 'util';
import { getVideosKey, videosSuffix } from './models/youtube.js';

rejson(redis);

const redisClient = createClient({
  host: 'localhost',
  password: 'your_password_for_redis',
  port: 6379,
});

const existsAsync = promisify(redisClient.exists).bind(redisClient);
const jsonSetAsync = promisify(redisClient.json_set).bind(redisClient);
const jsonGetAsync = promisify(redisClient.json_get).bind(redisClient);
const jsonArrAppendAsync = promisify(redisClient.json_arrappend).bind(redisClient);
const jsonArrLenAsync = promisify(redisClient.json_arrlen).bind(redisClient);
const jsonDelAsync = promisify(redisClient.json_del).bind(redisClient);
const jsonArrTrimAsync = promisify(redisClient.json_arrtrim).bind(redisClient);
const jsonArrInsertAsync = promisify(redisClient.json_arrinsert).bind(redisClient);

redisClient.on('ready', async () => {
  console.log(`Connected to Redis.`);

  const videosArrayExists = await existsAsync(getVideosKey(videosSuffix));
  if (!videosArrayExists) {
    console.log("Videos array doesn't exist. Creating...");
    await jsonSetAsync(getVideosKey(videosSuffix), '.', '[]');
    console.log('Done.');
  }
});

redisClient.on('error', err => {
  console.error(err);
});

export {
  redisClient,
  existsAsync,
  jsonSetAsync,
  jsonGetAsync,
  jsonArrAppendAsync,
  jsonArrLenAsync,
  jsonDelAsync,
  jsonArrTrimAsync,
  jsonArrInsertAsync,
};
