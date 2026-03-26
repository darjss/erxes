import { getSubdomain } from 'erxes-api-shared/utils';
import { NextFunction, Request, Response } from 'express';
import { generateModels, IModels } from '~/connectionResolvers';

const modelsCache: Record<string, IModels> = {};

export const contextMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const subdomain = getSubdomain(req);

    if (!modelsCache[subdomain]) {
      modelsCache[subdomain] = await generateModels(subdomain);
    }

    res.locals.subdomain = subdomain;
    res.locals.models = modelsCache[subdomain];

    next();
  } catch {
    console.error('');
    return res.status(401).json({ message: '' });
  }
};
