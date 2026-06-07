import { Request, Response } from 'express';
import Setting from '../models/Setting';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await Setting.find();
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const updates = req.body; // Array or Object of settings to update
    // Assuming updates is an array of { key, value }
    if (Array.isArray(updates)) {
      for (const item of updates) {
        await Setting.findOneAndUpdate({ key: item.key }, { value: item.value }, { upsert: true, new: true });
      }
    } else {
      // Single object update
      const { key, value } = updates;
      await Setting.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
    }
    const updatedSettings = await Setting.find();
    res.json(updatedSettings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
