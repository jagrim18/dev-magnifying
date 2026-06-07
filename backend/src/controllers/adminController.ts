import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';

export const authAdmin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
      });
      res.json({ token, email });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminProfile = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'Admin authenticated', admin: (req as any).admin });
};
