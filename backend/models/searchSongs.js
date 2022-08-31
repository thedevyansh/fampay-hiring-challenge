import { promisify } from 'util';
import { redisClient, jsonGetAsync } from '../redis_client.js';
import { getVideosKey, videosSuffix } from './youtube.js';
import 'dotenv/config.js';

async function searchSongs(title, description) {
  let original_array = JSON.parse(
    await jsonGetAsync(getVideosKey(videosSuffix), '.')
  );

  if (title == undefined) {
    return original_array.filter(video => {
      return video.description === description;
    });
  } else if (description == undefined) {
    return original_array.filter(video => {
      return video.title === title;
    });
  }

  return original_array.filter(video => {
    return video.title === title && video.description === description;
  });
}

export { searchSongs };
