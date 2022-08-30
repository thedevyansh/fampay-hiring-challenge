import { YoutubeDataAPI } from 'youtube-v3-api';
import * as cron from 'node-cron';
import { promisify } from 'util';
import redisClient from '../redis_client.js';
import 'dotenv/config.js';

const jsonSetAsync = promisify(redisClient.json_set).bind(redisClient);
const existsAsync = promisify(redisClient.exists).bind(redisClient);
const jsonArrAppendAsync = promisify(redisClient.json_arrappend).bind(redisClient);
const jsonDelAsync = promisify(redisClient.json_del).bind(redisClient);

const api = new YoutubeDataAPI(process.env.YOUTUBE_KEY);

const videosPrefix = 'videos:';
const videosSuffix = 'latest_videos';
const transientSuffix = 'transient_videos';
const getVideosKey = name => videosPrefix + name;

async function searchVideos(query) {
  let aMinuteAgo = new Date(Date.now() - 1000 * 60 * 10);
  let isoString = aMinuteAgo.toISOString().split('.')[0]+"Z"

  const response = await api.searchAll(query, 50, {
    type: 'video',
    order: 'date',
    publishedAfter: isoString
  });

  // console.log(response)
  // const nextPageToken = response?.nextPageToken

  const videos = Array.from(response.items).map(item => {
    const snippet = item.snippet;
    return {
      videoId: item.id.videoId,
      title: snippet.title,
      description: snippet.description,
      thumbnails: snippet.thumbnails,
      channelTitle: snippet.channelTitle,
      publishTime: snippet.publishTime,
    };
  });

  // create temporary array to store returned response
  await jsonSetAsync(getVideosKey(transientSuffix), '.', '[]')

  videos.forEach(async video => {
    try {
      await jsonArrAppendAsync(
        getVideosKey(transientSuffix),
        '.',
        JSON.stringify(video)
      );
    } catch (error) {
      console.log(error);
    }
  });

  // START FROM HERE NOW...

  const videosArrayExists = await existsAsync(getVideosKey(videosSuffix));
  if (!videosArrayExists) {
    await jsonSetAsync(getVideosKey(videosSuffix), '.', '[]');
  }

  return videos;
}

// cron.schedule('*/10 * * * *', function() {
//   // await searchVideos('cricket')

//   console.log("Runs every 10 mins");
// })

export { searchVideos };
