import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';

const { MUSHOP_SECRET = '', MUSHOP_PUBLIC_API_KEY = '' } = process.env || {};

export const validationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const signature = req.headers['x-signature'];

  if (!signature) {
    console.error('Missing signature');
    return res.status(401).json({ message: 'Missing signature' });
  }

  const secret = MUSHOP_SECRET || MUSHOP_PUBLIC_API_KEY;
  if (!secret) {
    console.error('Missing MUSHOP_SECRET/MUSHOP_PUBLIC_API_KEY');
    return res.status(500).json({ message: 'Server not configured' });
  }

  try {
    const expected = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature !== `sha256=${expected}`) {
      console.error('Invalid signature');
      return res.status(401).json({ message: 'Invalid signature' });
    }

    next();
  } catch {
    console.error('Unauthorized');
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
