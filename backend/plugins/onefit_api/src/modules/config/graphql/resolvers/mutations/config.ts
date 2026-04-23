import { IContext } from '~/connectionResolvers';
import { ISystemConfig } from '@/config/@types/config';

export const configMutations = {
  async systemConfigCreate(
    _root: undefined,
    doc: ISystemConfig,
    context: IContext,
  ) {
    const { models } = context;
    return await models.SystemConfig.createConfig({ ...doc });
  },

  async systemConfigUpdate(
    _root: undefined,
    { key, value }: { key: string; value: any },
    context: IContext,
  ) {
    const { models } = context;
    return await models.SystemConfig.updateConfig(key, value);
  },

  async oneFitSystemConfigUpdate(
    _root: undefined,
    { key, value }: { key: string; value: any },
    context: IContext,
  ) {
    const { models } = context;
    return await models.SystemConfig.updateConfig(key, value);
  },

  async systemConfigsRemove(
    _root: undefined,
    { keys }: { keys: string[] },
    context: IContext,
  ) {
    const { models } = context;
    return await models.SystemConfig.removeConfigs(keys);
  },

  async oneFitSystemConfigUpdateSelectedPayments(
    _root: undefined,
    { paymentIds }: { paymentIds: string[] },
    context: IContext,
  ) {
    const { models } = context;
    return await models.SystemConfig.updateConfig(
      'selectedPayments',
      paymentIds,
    );
  },
};
