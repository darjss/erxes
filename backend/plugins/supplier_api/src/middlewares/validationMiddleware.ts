import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';

export const validationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const signature = req.headers['x-signature'];

  if (!signature) {
    return res.status(401).json({ message: 'Missing signature' });
  }

  const secret = process.env.MUSHOP_SECRET || process.env.MUSHOP_PUBLIC_API_KEY || '';
  if (!secret) {
    return res.status(500).json({ message: 'Server not configured' });
  }

  try {
    const expected = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature !== `sha256=${expected}`) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
