import mongoose from 'mongoose';
import Admin from './src/models/Admin';
import dotenv from 'dotenv';
dotenv.config();

async function update() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  await Admin.deleteMany({});
  await Admin.create({ email: 'admin@magnifying.com', password: 'admin' });
  console.log('Admin recreated with email: admin@magnifying.com and password: admin');
  process.exit(0);
}
update();
