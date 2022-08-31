import { promisify } from 'util';
import { redisClient, jsonGetAsync, jsonArrLenAsync } from '../redis_client.js';
import { MAX_RESULTS, getVideosKey, videosSuffix } from './youtube.js';
import 'dotenv/config.js';

async function getPaginatedVideos(page) {
  if (page <= 0) {
    return [];
  }

  let left = MAX_RESULTS * (page - 1);
  let right = left + MAX_RESULTS - 1;

  let videos_length = await jsonArrLenAsync(getVideosKey(videosSuffix), '.');
  if (right >= videos_length) {
    right = videos_length - 1;
  }

  let videos = [];
  for (let i = left; i <= right; i++) {
    try {
      let video = await jsonGetAsync(getVideosKey(videosSuffix), `.[${i}]`);
      videos.push(JSON.parse(video));
    } catch (error) {
      console.log(error);
    }
  }

  return videos;
}

export { getPaginatedVideos };
