import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';

const { BTK_ADMIN_SECRET = '' } = process.env;

export const validator = (req: Request, res: Response, next: NextFunction) => {
  const signature = req.headers['x-signature'];

  if (!signature) {
    return res.status(401).json({ message: 'Missing signature' });
  }

  try {
    const expected = crypto
      .createHmac('sha256', BTK_ADMIN_SECRET)
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
