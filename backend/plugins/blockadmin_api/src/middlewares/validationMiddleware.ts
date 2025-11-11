import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const { BLOCK_ADMIN_SECRET = '' } = process.env || {};

export const validator = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, BLOCK_ADMIN_SECRET) as JwtPayload;

    if (!decoded || typeof decoded !== 'object') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
