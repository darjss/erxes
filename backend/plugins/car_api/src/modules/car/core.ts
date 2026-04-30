import { sendTRPCMessage } from 'erxes-api-shared/utils';

type RequiredCoreTRPCParams = {
  subdomain: string;
  module: string;
  action: string;
  input?: unknown;
  method?: 'query' | 'mutation';
  context?: Record<string, unknown>;
};

type RequiredTRPCParams = RequiredCoreTRPCParams & {
  pluginName: string;
};

export const requireTRPC = async <T>({
  subdomain,
  pluginName,
  module,
  action,
  input,
  method,
  context,
}: RequiredTRPCParams): Promise<T> => {
  const result = await sendTRPCMessage({
    subdomain,
    pluginName,
    module,
    action,
    input,
    method,
    context,
    defaultValue: null,
  });

  if (result === null || result === undefined) {
    throw new Error(
      `${pluginName} ${module}.${action} did not return a result`,
    );
  }

  return result as T;
};

export const requireCoreTRPC = async <T>(params: RequiredCoreTRPCParams) =>
  requireTRPC<T>({ ...params, pluginName: 'core' });

export const requireArrayResult = <T>(
  value: unknown,
  description: string,
): T[] => {
  if (!Array.isArray(value)) {
    throw new Error(`${description} must return an array`);
  }

  return value;
};
