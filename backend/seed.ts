import mongoose from 'mongoose';
import Category from './src/models/Category';
import Product from './src/models/Product';
import Admin from './src/models/Admin';
import dotenv from 'dotenv';

dotenv.config();

const categories = [
  {
    slug: 'laptop-screens',
    name: 'Laptop Screens',
    description: 'High-quality replacement screens for all major laptop brands',
  },
  {
    slug: 'monitor-parts',
    name: 'Monitor Components',
    description: 'Professional-grade monitor parts and components',
  },
  {
    slug: 'cctv-cameras',
    name: 'CCTV Cameras',
    description: 'Advanced surveillance camera systems',
  },
  {
    slug: 'cctv-accessories',
    name: 'CCTV Accessories',
    description: 'Complete range of CCTV mounting and connectivity solutions',
  },
  {
    slug: 'ac-parts',
    name: 'AC Spare Parts',
    description: 'Genuine air conditioner components and parts',
  },
  {
    slug: 'electronic-components',
    name: 'Electronic Components',
    description: 'Quality electronic parts for various applications',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/magnifying-solutions');
    console.log('Connected to MongoDB');

    // Insert categories if not exist
    for (const cat of categories) {
      await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true, new: true });
    }
    console.log('Categories seeded successfully!');

    // Seed Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@magnifying.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword';
    
    // Check if admin exists to avoid re-hashing password if we just update
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await Admin.create({ email: adminEmail, password: adminPassword });
      console.log('Admin user seeded successfully!');
    } else {
      console.log('Admin user already exists.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
