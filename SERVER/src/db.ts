import mongoose, { ConnectOptions } from 'mongoose';

const db = async (): Promise<void> => {
  try {
    
    const url = process.env.DB_URL?.replace(
      '<PASSWORD>',
      process.env.DB_PASS || '',
    );

    if (!url) {
      throw new Error('DB url is missing from .env variable');
    }

    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    console.log('DB connection successful');
  } catch (error) {
    console.error('An error occured connecting to DB', error);
  }
};

export default db;
