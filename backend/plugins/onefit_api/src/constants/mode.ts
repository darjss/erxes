import { getEnv } from 'erxes-api-shared/utils';

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

export const getOneFitInstanceId = (): string | undefined => {
  return getEnv({ name: 'ONEFIT_INSTANCE_ID' });
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

export const validateSlaveConfig = (): void => {
  if (isSlaveMode()) {
    const masterUrl = getOneFitMasterUrl();
    const instanceId = getOneFitInstanceId();

    if (!masterUrl) {
      throw new Error(
        'ONEFIT_MASTER_URL environment variable is required in slave mode',
      );
    }

    if (!instanceId) {
      throw new Error(
        'ONEFIT_INSTANCE_ID environment variable is required in slave mode',
      );
    }
  }
};
