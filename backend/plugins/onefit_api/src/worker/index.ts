import { IModels } from '~/connectionResolvers';
import { processCreditExpiration } from './creditExpiration';

export async function runWorkers(models: IModels) {
  // Run credit expiration daily
  await processCreditExpiration(models);
}

