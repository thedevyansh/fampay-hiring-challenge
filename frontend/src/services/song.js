import axios from 'axios';

const instance = axios.create({
  baseURL:
    !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000'
      : 'https://groowe.herokuapp.com',
  withCredentials: true,
});

export const paginatedSearch = async page => {
  return await instance.get('/api/song/paginatedSearch', { params: { page } });
};

export const search = async search => {
  if (search.title && search.description) {
    return await instance.get('/api/song/search', {
      params: { title: search.title, description: search.description },
    });
  }
  if (search.title) {
    return await instance.get('/api/song/search', {
      params: { title: search.title },
    });
  }
  if (search.description) {
    return await instance.get('/api/song/search', {
      params: { description: search.description },
    });
  }
  return await instance.get('/api/song/search', {
    params: { title: '', description: '' },
  });
};
