import { NextFunction } from 'express';
import { IMAGE_FIELDS } from '~/constants';
import { IImageFields, IRequest, IResponse } from '~/types';

const { BTK_API_URL = '' } = process.env || {};

export const modifierMiddleware = (
  req: IRequest<IImageFields, {}>,
  res: IResponse,
  next: NextFunction,
) => {
  if (!BTK_API_URL) {
    throw new Error('BTK_API_URL is not set');
  }

  try {
    const { subdomain, payload } = req.body || {};

    const { data } = payload || {};

    const { input } = data || {};

    const BTK_DOMAIN = BTK_API_URL.replace('<subdomain>', subdomain);

    if (IMAGE_FIELDS.some((image_field) => input.hasOwnProperty(image_field))) {
      for (const field of IMAGE_FIELDS) {
        if (!Object.prototype.hasOwnProperty.call(input, field)) continue;

        const value = input[field];

        if (Array.isArray(value)) {
          const newValues: string[] = [];

          for (const image of value) {
            if (image.startsWith(BTK_DOMAIN)) {
              newValues.push(image);
            } else {
              newValues.push(`${BTK_DOMAIN}/read-file?key=${image}`);
            }
          }

          input[field] = newValues;
        } else if (typeof value === 'string' && !value.startsWith(BTK_DOMAIN)) {
          input[field] = `${BTK_DOMAIN}/read-file?key=${value}`;
        }
      }
    }

    next();
  } catch {
    console.error('Invalid request');
    return res.status(401).json({ message: 'Invalid request' });
  }
};
