// Builds the Express app (middleware + routes). index.js starts it.
// Order matters: security/parsers first, then routes, then 404, then the error handler LAST.

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { env, isProduction } from './config/env.js';
import routes from './routes/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Render sits behind a proxy. Without this, the rate limiter would see everyone as one IP.
app.set('trust proxy', 1);

app.use(helmet()); // safe default security headers

// CORS: only our frontend (FRONTEND_URL) and localhost (any port) may call the API from a browser.
// Requests with no Origin header (Postman, curl, Render health checks) are allowed.
const localhost = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === env.frontendUrl || localhost.test(origin)) {
        return callback(null, true);
      }
      callback(null, false); // browser blocks it
    },
  }),
);

app.use(express.json({ limit: '100kb' })); // parse JSON bodies
app.use(morgan(isProduction ? 'combined' : 'dev')); // request log

app.use(routes);

app.use(notFound);
app.use(errorHandler);

export default app;
