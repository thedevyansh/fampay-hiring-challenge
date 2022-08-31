import express from 'express';
import { getPaginatedVideos } from '../models/pagination.js';
import { searchSongs } from '../models/searchSongs.js';

const router = express.Router();

router.get('/search', async (req, res) => {
  const title = req.query.title;
  const description = req.query.description;
  const videos = await searchSongs(title, description);

  res.status(200).json({ success: true, videos });
});

router.get('/paginatedSearch', async (req, res) => {
  const query = req.query.page;
  const videos = await getPaginatedVideos(query);

  res.status(200).json({ success: true, videos });
});

export default router;
