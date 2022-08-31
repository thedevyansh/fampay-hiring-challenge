import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import logger from 'morgan';

import { redisClient } from './redis_client.js';
import songRouter from './routes/song.js';

import 'dotenv/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ['*', "'unsafe-inline'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          'https://www.youtube.com',
        ],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ['*', "'unsafe-inline'", 'https://www.youtube.com'],
        frameSrc: ["'self'", "'unsafe-inline'", 'https://www.youtube.com'],
      },
    },
    referrerPolicy: {
      policy: ['origin', 'unsafe-url'],
    },
  })
);

app.use(logger('dev'));
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(join(__dirname, 'public')));

app.use('/api/song', songRouter);

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err);

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

app.get('*', function (req, res, next) {
  res.sendFile(join(__dirname, 'public') + '/index.html');
});

export default app;
