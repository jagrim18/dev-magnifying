import { Request, Response } from 'express';
import Event from '../models/Event';
import Product from '../models/Product';
import mongoose from 'mongoose';

export const logVisit = async (req: Request, res: Response) => {
  try {
    await Event.create({ type: 'visit' });
    res.status(201).json({ message: 'Visit logged' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const logInquiry = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    if (productId && mongoose.Types.ObjectId.isValid(productId)) {
      await Event.create({ type: 'inquiry', productId });
      res.status(201).json({ message: 'Inquiry logged' });
    } else {
      res.status(400).json({ message: 'Invalid or missing productId' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    // 1. Get graph data (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyStats = await Event.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            type: "$type"
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Format for Recharts: [{ name: 'Mon', visits: 10, inquiries: 5 }, ...]
    const graphDataMap = new Map();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const name = d.toLocaleDateString('en-US', { weekday: 'short' });
      graphDataMap.set(dateStr, { name, visits: 0, inquiries: 0 });
    }

    dailyStats.forEach(stat => {
      const dateStr = stat._id.date;
      if (graphDataMap.has(dateStr)) {
        const obj = graphDataMap.get(dateStr);
        if (stat._id.type === 'visit') obj.visits = stat.count;
        if (stat._id.type === 'inquiry') obj.inquiries = stat.count;
      }
    });

    const graphData = Array.from(graphDataMap.values());

    // 2. Get most inquired product
    const topInquiries = await Event.aggregate([
      { $match: { type: 'inquiry' } },
      { $group: { _id: "$productId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    let mostInquiredProduct = null;
    if (topInquiries.length > 0 && topInquiries[0]._id) {
      const product = await Product.findById(topInquiries[0]._id);
      if (product) {
        mostInquiredProduct = {
          name: product.name,
          count: topInquiries[0].count
        };
      }
    }

    // 3. Totals
    const totalVisits = await Event.countDocuments({ type: 'visit' });
    const totalInquiries = await Event.countDocuments({ type: 'inquiry' });

    res.json({
      graphData,
      mostInquiredProduct,
      totalVisits,
      totalInquiries
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
