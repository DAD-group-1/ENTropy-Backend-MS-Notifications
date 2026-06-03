import mongoose from 'mongoose';
import { buildMongoUri } from './utils.js';

export const createDatabase = async () => {
  const uri = buildMongoUri();

  await mongoose.connect(uri);

  return mongoose;
};
