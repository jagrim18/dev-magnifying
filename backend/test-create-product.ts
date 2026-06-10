import mongoose from 'mongoose';
import Product from './src/models/Product';
import Category from './src/models/Category';
import dotenv from 'dotenv';

dotenv.config();

async function test() {
  await mongoose.connect(process.env.MONGODB_URI || '');
  console.log('Connected to DB');

  try {
    let reqBody = {
      name: 'Valid Name',
      category: new mongoose.Types.ObjectId().toString(), // Valid ObjectId string
      brand: '',
      sku: '',
      description: 'ddd',
      specifications: [{ key: 'ddd', value: 'ddd' }],
      images: [""],
      isFeatured: false
    };

    let { category, brand, sku, ...rest } = reqBody;
    
    // Auto-generate sku if missing
    if (!sku) {
      sku = 'SKU-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    // Auto-fill brand if missing
    if (!brand) {
      brand = 'Generic';
    }

    // Resolve category slug to ObjectId if needed
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      const cat = await Category.findOne({ slug: category });
      if (cat) {
        category = cat._id as any;
      }
    }

    const product = new Product({ ...rest, category, brand, sku });
    await product.validate();
    console.log('Validation passed!');
  } catch (error) {
    console.error('Validation failed:', error);
  }

  mongoose.disconnect();
}

test();
