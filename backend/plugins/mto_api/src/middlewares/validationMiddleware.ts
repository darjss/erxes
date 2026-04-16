import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';

const { BLOCK_ADMIN_SECRET = '' } = process.env || {};

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

  try {
    const expected = crypto
      .createHmac('sha256', BLOCK_ADMIN_SECRET)
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
