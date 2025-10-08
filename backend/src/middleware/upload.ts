import multer from 'multer';
import { Request } from 'express';

// Configure multer storage
const storage = multer.memoryStorage();

// File filter for Excel files
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept Excel files
  if (
    file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || // .xlsx
    file.mimetype === 'application/vnd.ms-excel' || // .xls
    file.mimetype === 'text/csv' || // .csv
    file.originalname.endsWith('.xlsx') ||
    file.originalname.endsWith('.xls') ||
    file.originalname.endsWith('.csv')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only Excel and CSV files are allowed.'));
  }
};

// Create multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});