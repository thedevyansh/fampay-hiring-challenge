import { YoutubeDataAPI } from 'youtube-v3-api';
import parseIsoDuration from 'parse-iso-duration';
import 'dotenv/config.js';

const api = new YoutubeDataAPI(process.env.YOUTUBE_KEY);

async function searchVideos(query) {
  const response = await api.searchAll(query, 10, { type: 'video' });

  const videos = Array.from(response.items).map(item => {
    const snippet = item.snippet;
    return {
      videoId: item.id.videoId,
      title: snippet.title,
      thumbnails: snippet.thumbnails,
      channelTitle: snippet.channelTitle,
    };
  });
  
  // const exhaustiveVideos = Array.from(response.items).map(item => {
  //   return {
  //     publishedAt: item.snippet.publishedAt,
  //     publishTime: item.snippet.publishTime,
  //     title: item.snippet.title
  //   };
  // });

  // console.log(exhaustiveVideos)

  return videos;
}

async function getVideoDuration(videoId) {
  const response = await api.searchVideo(videoId);

  if (response.items.length === 0) {
    return null;
  }

  const data = response.items[0];
  const duration = parseIsoDuration(data.contentDetails.duration);

  return duration;
}

export { searchVideos, getVideoDuration };
