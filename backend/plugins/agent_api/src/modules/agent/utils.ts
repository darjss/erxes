import { getEnv } from 'erxes-api-shared/utils';
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

  const body = {
    ...payload,
    botName: BOT_NAME,
    moonshotApiKey: MOONSHOT_API_KEY,
  };

  const response = await fetch(DEPLOYER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const raw = await response.text();
    let message = raw;
    try {
      const parsed = JSON.parse(raw) as { error?: string };
      if (parsed?.error === 'Not found') {
        message =
          'Deployer could not create the agent. Check DEPLOYER_URL and try again.';
      } else if (parsed?.error) {
        message = parsed.error;
      }
    } catch {
      // use raw text as message
    }
    throw new Error(`Deployment failed: ${message}`);
  }

  return response.json();
};

export const approveServer = async (
  agent: IAgentServerDocument,
  code: string,
) => {
  const DEPLOYER = getEnv({ name: 'DEPLOYER_URL' });

  console.log(agent.name);

  const DEPLOYER_URL = `${DEPLOYER}/tools/${agent.name}/discordapprove`;

  const body = { approveToken: code };

  const response = await fetch(DEPLOYER_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const raw = await response.text();
    let message = raw;
    try {
      const parsed = JSON.parse(raw) as { error?: string };
      if (parsed?.error === 'Not found') {
        message =
          'Agent was not found by the deployer. It may still be deploying—try again in a few minutes, or redeploy.';
      } else if (parsed?.error) {
        message = parsed.error;
      }
    } catch {
      // use raw text as message
    }
    throw new Error(`Approve failed: ${message}`);
  }

  return response.json();
};

export const destroyServer = async (agent: IAgentServerDocument) => {
  const DEPLOYER = getEnv({ name: 'DEPLOYER_URL' });

  const DEPLOYER_URL = `${DEPLOYER}/agents/${agent.name}`;

  const response = await fetch(DEPLOYER_URL, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const raw = await response.text();
    let message = raw;
    try {
      const parsed = JSON.parse(raw) as { error?: string };
      if (parsed?.error) {
        message = parsed.error;
      }
    } catch {
      // use raw text as message
    }
    throw new Error(`Destroy failed: ${message}`);
  }

  return response.json();
};

// // agents.delete("/:serverName", async c => {
//   const { serverName } = c.req.param();
//   try {
//     await destroyServer(serverName);
//     return c.json({ success: true });
//   } catch (err: any) {
//     return c.json({ error: err.message }, 500);
//   }
// });
