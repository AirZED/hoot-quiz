import express, { Request, Response, NextFunction } from 'express';
import AppError from './utils/appError';
import globalErrorHandler from './controllers/errorController';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

// log morgan
// if (process.env.NODE_ENV === 'development') {
app.use(morgan('dev'));
// }

// parse the body
app.use(cors());
app.use(express.json({ limit: '10kb' }));

import userRoute from './routes/userRoute';
import questionRoute from './routes/questionRoute';
import sessionRoute from './routes/sessionRoute';

app.use('/api/v1/user', userRoute);
app.use('/api/v1/question', questionRoute);
app.use('/api/v1/session', sessionRoute);

app.get('/', (req: Request, res: Response) => {
  res.send('api is running on live port');
});

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const message: string = `${req.originalUrl} route cannot be found on this server`;
  return next(new AppError(message, 404));
});

app.use(globalErrorHandler.globalSendError);

export default app;
