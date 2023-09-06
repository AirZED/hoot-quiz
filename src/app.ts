import express, { Request, Response, NextFunction } from 'express';

const app = express();

// parse the body
app.use(express.json({ limit: '10kb' }));

import userRoutes from './routes/userRoute';

app.use('/api/v1/user', userRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

export default app;
