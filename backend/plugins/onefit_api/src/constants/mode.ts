import {
  getEnv,
  getSaasOrganizationIdBySubdomain,
} from 'erxes-api-shared/utils';
import { generateModels } from '~/connectionResolvers';

export type OneFitMode = 'master' | 'slave';

export const getOneFitMode = (): OneFitMode => {
  const mode = getEnv({ name: 'ONEFIT_MODE', defaultValue: 'master' });
  if (mode === 'slave') {
    return 'slave';
  }
  return 'master';
};

export const getOneFitMasterUrl = (): string | undefined => {
  return getEnv({ name: 'ONEFIT_MASTER_URL' });
};

export const getOneFitInstanceId = async (
  subdomain: string,
): Promise<string | undefined> => {
  const models = await generateModels(subdomain);
  const configInstance = await models.SystemConfig.getConfig('instanceId');
  return configInstance?.value;
};

export const isSlaveMode = (): boolean => {
  return getOneFitMode() === 'slave';
};

export const isMasterMode = (): boolean => {
  return getOneFitMode() === 'master';
};
export const getOneFitSecret = (): string | undefined => {
  return getEnv({ name: 'ONEFIT_AUTH_TOKEN' });
};
