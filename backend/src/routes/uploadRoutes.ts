import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import { protect } from '../middleware/auth';

const router = express.Router();

const storage = multer.memoryStorage();

function checkFileType(file: any, cb: any) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post('/', protect, upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const compressedBuffer = await sharp(req.file.buffer)
      .resize(500)
      .webp({ quality: 80 })
      .toBuffer();

    const base64Image = `data:image/webp;base64,${compressedBuffer.toString('base64')}`;

    res.json({
      message: 'Image processed successfully',
      url: base64Image,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Upload failed' });
  }
});

export default router;
