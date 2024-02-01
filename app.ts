import dotenv from 'dotenv';
dotenv.config();

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

import logger from './config/logger';
import { DatabaseInitialization } from './orm/DbCreateConnection';
import config from './resources/config';
import routing from './routes/';
import { EmailSQSSubscriberService } from './services/email/sqsSubscriber';
import swaggerSpec from './swagger';

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
// Logging middleware
app.use((req, res, next) => {
  if (
    `${req.method} ${req.url}` != 'GET /notification-service/v1/health-check'
  ) {
    logger.info(`${req.method} ${req.url}`);
  }
  next();
});

// Route setup
app.use('/', routing);

// Swagger documentation route
if (process.env.NS_NODE_ENV != 'prod') {
  app.use(
    `${config.baseUrl}/api-docs`,
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec),
  );
}

// 404 and error handlers
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

app.use(function (err: any, req: Request, res: Response) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Send the error response as JSON
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      stack: req.app.get('env') === 'development' ? err.stack : undefined,
    },
  });
});

// Initialization function
const initializeApp = async () => {
  await DatabaseInitialization.dbCreateConnection();
  await EmailSQSSubscriberService.startListening(); // Start the SQS listener service for Email messages
};

// Call the initialization function to start the necessary services
initializeApp();

module.exports = app;
