import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';

const { BTK_ADMIN_SECRET = '' } = process.env || {};

export const validator = (req: Request, res: Response, next: NextFunction) => {
  const signature = req.headers['x-signature'];

  console.log(signature, 'signature');

  if (!signature) {
    console.log('Missing signature');
    return res.status(401).json({ message: 'Missing signature' });
  }

  try {
    const expected = crypto
      .createHmac('sha256', BTK_ADMIN_SECRET)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature !== `sha256=${expected}`) {
      console.log('Invalid signature');
      return res.status(401).json({ message: 'Invalid signature' });
    }

    next();
  } catch {
    console.log('Unauthorized');
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
