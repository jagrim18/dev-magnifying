import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dev-magnifying');
    const product = await Product.findOne();
    console.log("Images array:");
    console.log(product?.images);
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
};

run();
