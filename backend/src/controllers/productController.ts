import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';

const productCache = new Map<string, { expiry: number; data: any }>();
const CACHE_TTL = 60 * 1000; // 1 minute

export const clearProductCache = () => productCache.clear();

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

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const cacheKey = JSON.stringify({ category, search, isFeatured, page, limit });
    const cached = productCache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      res.set('x-total-count', cached.data.total.toString());
      res.set('x-total-pages', Math.ceil(cached.data.total / limit).toString());
      res.set('x-current-page', page.toString());
      res.set('x-cache', 'HIT');
      return res.json(cached.data.products);
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .skip(skip)
      .limit(limit)
      .lean();

    const formattedProducts = products.map((p: any) => {
      p.id = p._id.toString();
      if (p.category && p.category._id) {
        p.category.id = p.category._id.toString();
      }
      return p;
    });

    const total = await Product.countDocuments(query);
    
    productCache.set(cacheKey, {
      expiry: Date.now() + CACHE_TTL,
      data: { products: formattedProducts, total }
    });

    res.set('x-total-count', total.toString());
    res.set('x-total-pages', Math.ceil(total / limit).toString());
    res.set('x-current-page', page.toString());

    res.json(formattedProducts);
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
    clearProductCache();
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
    clearProductCache();
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
    clearProductCache();
    res.json({ message: 'Product removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
