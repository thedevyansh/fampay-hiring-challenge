# Backend Assignment | FamPay

## Project Goal

To make an API to fetch latest videos sorted in reverse chronological order of their publishing date-time from YouTube for a given tag/search query in a paginated response.

## Requirements achieved

- Node.js server runs a cron job at a regular interval of **10 minutes** that fetches the latest videos for a predefined search query (in our case, _cricket_) using the YouTube API. It stores the data of videos in a Redis JSON array (RedisJSON) containing the following fields:

  - Video ID
  - Title
  - Description
  - Thumbnail URLs
  - Channel Title
  - Publishing datetime

- A GET API which returns the stored video data in a paginated response sorted in descending order of published datetime.
- A basic search API to search the stored videos using their title and description.

- Support for supplying multiple API keys so that if quota is exhausted for one, it automatically uses the next available key.

- A dashboard to view the stored videos in the paginated view.

- Focused on creating modules, ensured meaningful variable/function names and maintained indentation and code style.

## Tech Stack

- JavaScript (Node.js)
- Redis with RedisJSON

### Dashboard

Paginated response using the GET API (maxResults = 50):

<img src="snapshots/2.png" alt="dashboard with videos in reverse chronological order" />

<br>

No videos returned on requesting an invalid page number:

<img src="snapshots/3.png" alt="no more videos found" />

### Format of video data stored in Redis

<img src="snapshots/1.png" alt="video format" />

## Usage

### Get API

http://localhost:5000/api/song/paginatedSearch?page={page_number}

<img src="snapshots/4.png" alt="get api response" />

In the JavaScript code, the API can be leveraged using the following service:

```javascript
import * as songApi from './services/song

const fetchResponse = async page => {
    const response = await songApi.paginatedSearch(page);
}
```

### Basic Search API

http://localhost:5000/api/song/search?title={title}&description={description}

<img src="snapshots/5.png" alt="get api response" />

In the JavaScript code, it can be leveraged using the following service:

```javascript
import * as songApi from './services/song

const fetchResponse = async page => {
    const response = await songApi.search({
      title: "title_here",
      description: "description_here"
    });
}
```

**Note:** Atleast one of the `title` or `description` parameters has to be supplied to the search API!

### Points to note

- The GET API can return a maximum of 50 latest videos in a paginated response.
- To create the proof of concept (POC), the maximum number of _most recent cricket videos_ that can be stored in the Redis database are limited to 2000 to save on API calls to YouTube.

## How to run it locally?

### Prerequisites:

- Node.js
- npm
- Redis with RedisJSON

I used the [redislab/rejson](https://hub.docker.com/r/redislabs/rejson/) Docker image to setup the Redis module.

1. Clone the repository.
2. Run the above Docker image (RedisJSON).
3. In the root directory of **backend**, put your API key(s) in YOUTUBE_API_KEYS inside `apikeys.js` like so:

```javascript
const YOUTUBE_API_KEYS = [
  <api_key_1>,
  <api_key_2>,
  ...
];
```

4. In **backend**, type: `npm install` to install dependencies and run `npm start`
5. In the root directory of **frontend**, type: `npm install` to install dependencies and run `npm start`.
6. Your app should now be running at **localhost:3000** ✨
