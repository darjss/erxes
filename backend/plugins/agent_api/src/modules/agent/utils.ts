import { getEnv } from 'erxes-api-shared/src/utils';
import { IAgentServerDocument } from './@types/agent';

interface DeployPaylaod {
  orgId: string;
  agentId: string;
  discordBotToken: string;
}

interface DeployResponse {
  serverName: string;
  serverUrl: string;
  gatewayToken: string;
  serverId: number;
}

export const deployServer = async (
  payload: DeployPaylaod,
): Promise<DeployResponse> => {
  const DEPLOYER = getEnv({ name: 'DEPLOYER_URL' });
  const BOT_NAME = getEnv({ name: 'BOT_NAME' });
  const MOONSHOT_API_KEY = getEnv({ name: 'MOONSHOT_API_KEY' });

  if (!DEPLOYER) {
    throw new Error('DEPLOYER_URL environment variable is required');
  }

  const DEPLOYER_URL = `${DEPLOYER}/agents/deploy`;

  const body = { ...payload, botName: BOT_NAME, moonshotApiKey: MOONSHOT_API_KEY }

  const response = await fetch(DEPLOYER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();

    throw new Error(`Deployment failed: ${error}`);
  }

  return response.json();
};

export const approveServer = async (agent: IAgentServerDocument, code: string) => {
  const DEPLOYER = getEnv({ name: 'DEPLOYER_URL' });

  const DEPLOYER_URL = `${DEPLOYER}/tools/${agent.name}/discordapprove`;

  const body = { accessToken: code }

  const response = await fetch(DEPLOYER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();

    throw new Error(`Approve failed: ${error}`);
  }

  return response.json();
}