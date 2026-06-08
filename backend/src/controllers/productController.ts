import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, isFeatured } = req.query;
    let query: any = {};

    if (category) query.category = category;
    if (isFeatured === 'true') query.isFeatured = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query).populate('category', 'name slug');
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

import Category from '../models/Category';

export const createProduct = async (req: Request, res: Response) => {
  try {
    let { category, brand, sku, images, ...rest } = req.body;
    
    // Auto-generate sku if missing
    if (!sku) {
      sku = 'SKU-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    // Auto-fill brand if missing
    if (!brand) {
      brand = 'Generic';
    }

    // Filter empty strings from images
    if (images && Array.isArray(images)) {
      images = images.filter(img => img && img.trim() !== "");
    }

    // Resolve category slug to ObjectId if needed
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      const cat = await Category.findOne({ slug: category });
      if (cat) {
        category = cat._id;
      } else {
        return res.status(400).json({ message: `Category not found for slug: ${category}` });
      }
    }

    const product = await Product.create({ ...rest, category, brand, sku, images });
    res.status(201).json(product);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: `Invalid ID/Value format: ${error.message}` });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: `Duplicate value entered for ${Object.keys(error.keyValue)} field` });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    let { category, images, ...rest } = req.body;
    
    // Filter empty strings from images
    if (images && Array.isArray(images)) {
      images = images.filter(img => img && img.trim() !== "");
    }

    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      const cat = await Category.findOne({ slug: category });
      if (cat) {
        category = cat._id;
      } else {
        return res.status(400).json({ message: `Category not found for slug: ${category}` });
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, { ...rest, category, images }, { new: true, runValidators: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: `Invalid ID/Value format: ${error.message}` });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: `Duplicate value entered for ${Object.keys(error.keyValue)} field` });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
