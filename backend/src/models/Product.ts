import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  category: mongoose.Types.ObjectId;
  brand: string;
  sku: string;
  images: string[];
  specifications: { key: string; value: string }[];
  isFeatured: boolean;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, index: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  brand: { type: String, required: true, index: true },
  sku: { type: String, required: true, unique: true },
  images: [{ type: String }],
  specifications: [{ 
    key: { type: String, required: true },
    value: { type: String, required: true }
  }],
  isFeatured: { type: Boolean, default: false, index: true }
}, {
  timestamps: true
});

export default mongoose.model<IProduct>('Product', ProductSchema);
