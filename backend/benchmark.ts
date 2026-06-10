import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product';
import Category from './src/models/Category';
import { performance } from 'perf_hooks';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dev-magnifying');
    
    // Warm up
    await Category.findOne();
    
    // Benchmark Product.find
    const start1 = performance.now();
    const query = {};
    const skip = 0;
    const limit = 50;
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .skip(skip)
      .limit(limit)
      .lean();
    const end1 = performance.now();
    
    console.log(`Product.find took ${(end1 - start1).toFixed(2)} ms. Products count: ${products.length}`);
    
    // Benchmark Product.countDocuments
    const start2 = performance.now();
    const total = await Product.countDocuments(query);
    const end2 = performance.now();
    
    console.log(`Product.countDocuments took ${(end2 - start2).toFixed(2)} ms. Total count: ${total}`);

    // Print out image formats
    console.log('Sample images:');
    let foundImages = 0;
    for (const p of products) {
        if (p.images && p.images.length > 0) {
            console.log(p.images);
            foundImages++;
            if (foundImages > 3) break;
        }
    }

    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
};

run();
