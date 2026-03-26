import { IContext } from '~/connectionResolvers';
import { ISystemConfig } from '@/config/@types/config';

export const configMutations = {
  async mtoSystemConfigCreate(
    _root: undefined,
    doc: ISystemConfig,
    { models }: IContext,
  ) {
    return await models.SystemConfig.createConfig({ ...doc });
  },

  async mtoSystemConfigUpdate(
    _root: undefined,
    { key, value }: { key: string; value: any },
    { models }: IContext,
  ) {
    return await models.SystemConfig.updateConfig(key, value);
  },

  async mtoSystemConfigsRemove(
    _root: undefined,
    { keys }: { keys: string[] },
    { models }: IContext,
  ) {
    return await models.SystemConfig.removeConfigs(keys);
  },

  async mtoSystemConfigUpdateSelectedPayments(
    _root: undefined,
    { paymentIds }: { paymentIds: string[] },
    { models }: IContext,
  ) {
    return await models.SystemConfig.updateConfig(
      'selectedPayments',
      paymentIds,
    );
  },
};
