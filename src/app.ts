import express, { Request, Response, NextFunction } from 'express';
import AppError from './utils/appError';
import globalErrorHandler from './controllers/errorController';

const app = express();

// parse the body
app.use(express.json({ limit: '10kb' }));

import userRoutes from './routes/userRoute';

app.use('/api/v1/user', userRoutes);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const message: string = `${req.originalUrl} route cannot be found on this server`;
  return next(new AppError(message, 404));
});

app.use(globalErrorHandler.globalSendError);

export default app;
