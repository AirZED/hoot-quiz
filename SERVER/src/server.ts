import dotenv from 'dotenv';

// importing dotenv file
dotenv.config({ path: './.env' });
import db from './db';

import app from './app';
const port = process.env.PORT || 3000;

db();

app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
