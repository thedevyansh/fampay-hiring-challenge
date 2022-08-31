import { YoutubeDataAPI } from 'youtube-v3-api';
import * as cron from 'node-cron';
import {
  jsonGetAsync,
  jsonSetAsync,
  jsonArrAppendAsync,
  jsonArrLenAsync,
  jsonDelAsync,
  jsonArrTrimAsync,
  jsonArrInsertAsync,
} from '../redis_client.js';
import { YOUTUBE_API_KEYS } from '../apikeys.js';

const THRESHOLD = 2000;
const MAX_RESULTS = 50;

const videosPrefix = 'videos:';
const videosSuffix = 'latest_videos';
const transientSuffix = 'transient_videos';
const getVideosKey = name => videosPrefix + name;

async function fetchLatestVideos(query) {
  await jsonSetAsync(getVideosKey(transientSuffix), '.', '[]');

  let tenMinuteAgo = new Date(Date.now() - 1000 * 60 * 10);
  let isoString = tenMinuteAgo.toISOString().split('.')[0] + 'Z';

  let valid = false,
    response = {},
    videos = [];

  for (let i = 0; i < YOUTUBE_API_KEYS.length; i++) {
    let api = new YoutubeDataAPI(YOUTUBE_API_KEYS[i]);

    try {
      response = await api.searchAll(query, MAX_RESULTS, {
        type: 'video',
        order: 'date',
        publishedAfter: isoString,
      });
      valid = true;
    } catch (err) {
      console.log('Invalid API key: ', err);
    }

    if (valid) {
      break;
    }
  }

  if (!valid) {
    await jsonDelAsync(getVideosKey(transientSuffix), '.');
    return;
  } else {
    videos = Array.from(response.items).map(item => {
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
  }

  let transient_videos_length = await jsonArrLenAsync(
    getVideosKey(transientSuffix),
    '.'
  );

  let nextPageToken = response?.nextPageToken;

  while (transient_videos_length < THRESHOLD && nextPageToken != undefined) {
    valid = false;

    for (let i = 0; i < YOUTUBE_API_KEYS.length; i++) {
      let api = new YoutubeDataAPI(YOUTUBE_API_KEYS[i]);

      try {
        response = await api.searchAll(query, MAX_RESULTS, {
          type: 'video',
          order: 'date',
          publishedAfter: isoString,
          pageToken: nextPageToken,
        });
        valid = true;
      } catch (err) {
        console.log('Invalid API key: ', err);
      }

      if (valid) {
        break;
      }
    }

    if (!valid) {
      break;
    } else {
      videos = Array.from(response.items).map(item => {
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

      transient_videos_length += videos.length;
      nextPageToken = response?.nextPageToken;
    }
  }

  if (transient_videos_length >= THRESHOLD) {
    await jsonSetAsync(getVideosKey(videosSuffix), '.', '[]');

    for (let i = 0; i < transient_videos_length; i++) {
      try {
        let video = await jsonGetAsync(
          getVideosKey(transientSuffix),
          `.[${i}]`
        );
        await jsonArrAppendAsync(getVideosKey(videosSuffix), '.', video);
      } catch (error) {
        console.log(error);
      }
    }
  } else {
    let videos_length = await jsonArrLenAsync(getVideosKey(videosSuffix), '.');
    let total_videos = transient_videos_length + videos_length;
    if (total_videos > THRESHOLD) {
      let excess_videos = total_videos - THRESHOLD;
      await jsonArrTrimAsync(
        getVideosKey(videosSuffix),
        '.',
        0,
        videos_length - excess_videos - 1
      );
    }

    for (let i = transient_videos_length - 1; i >= 0; i--) {
      try {
        let video = await jsonGetAsync(
          getVideosKey(transientSuffix),
          `.[${i}]`
        );
        await jsonArrInsertAsync(getVideosKey(videosSuffix), '.', 0, video);
      } catch (error) {
        console.log(error);
      }
    }
  }

  await jsonDelAsync(getVideosKey(transientSuffix), '.');
}

cron.schedule('*/10 * * * *', async () => {
  console.log('Running cron job...');
  await fetchLatestVideos('cricket');
  console.log('Success.');
});

export { getVideosKey, videosSuffix, THRESHOLD, MAX_RESULTS };
