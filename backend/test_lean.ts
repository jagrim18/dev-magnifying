import mongoose from 'mongoose';
import Product from './src/models/Product';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

mongoose.connect(process.env.MONGODB_URI as string).then(async () => {
  const products = await Product.find().sort({_id:-1}).limit(1).lean();
  console.log(JSON.stringify(products, null, 2));
  process.exit();
}).catch(console.error);
