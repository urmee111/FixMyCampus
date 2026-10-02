// Builds the Express app (middleware + routes). index.js starts it.
// Order matters: security/parsers first, then routes, then 404, then the error handler LAST.

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { allowedOrigins, isProduction } from './config/env.js';
import routes from './routes/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Render sits behind a proxy. Without this, the rate limiter would see everyone as one IP.
app.set('trust proxy', 1);

app.use(helmet()); // safe default security headers

// CORS: a browser may call the API only from the addresses in FRONTEND_URL (plus http://localhost:5173
// when not in production). Other websites get no CORS headers, so the browser blocks them.
// Requests with no Origin header (Postman, curl, Render health checks) are not affected by CORS.
app.use(cors({ origin: allowedOrigins }));

app.use(express.json({ limit: '100kb' })); // parse JSON bodies
app.use(morgan(isProduction ? 'combined' : 'dev')); // request log

app.use(routes);

app.use(notFound);
app.use(errorHandler);

export default app;
