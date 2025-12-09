import { IContext } from '~/connectionResolvers';
import { ISystemConfig } from '@/config/@types/config';

export const configMutations = {
  async systemConfigCreate(
    _root: undefined,
    doc: ISystemConfig,
    { models }: IContext,
  ) {
    return await models.SystemConfig.createConfig({ ...doc });
  },

  async systemConfigUpdate(
    _root: undefined,
    { key, value }: { key: string; value: any },
    { models }: IContext,
  ) {
    return await models.SystemConfig.updateConfig(key, value);
  },

  async systemConfigsRemove(
    _root: undefined,
    { keys }: { keys: string[] },
    { models }: IContext,
  ) {
    return await models.SystemConfig.removeConfigs(keys);
  },
};

