import { Request, Response, NextFunction } from 'express';
import { isSlaveMode, getOneFitInstanceId } from '~/constants/mode';
import { getMasterClient } from '~/utils/masterClient';
import { getSubdomain } from 'erxes-api-shared/utils';

/**
 * Middleware that intercepts GraphQL requests in slave mode
 * and forwards them to the master instance
 */
export const graphqlProxyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('this works');
  // Only intercept GraphQL requests
  if (req.path !== '/graphql' || req.method !== 'POST') {
    return next();
  }

  // Only proxy in slave mode
  if (!isSlaveMode()) {
    return next();
  }

  try {
    const masterClient = getMasterClient();
    const subdomain = getSubdomain(req);
    const instanceId = getOneFitInstanceId();

    // Get the GraphQL request body
    const { query, variables, operationName } = req.body;

    if (!query) {
      return next();
    }

    // Forward headers for authentication and context
    const headers: Record<string, string> = {};

    // Forward important headers
    if (req.headers.authorization) {
      headers.authorization = req.headers.authorization as string;
    }
    if (req.headers['x-subdomain']) {
      headers['x-subdomain'] = req.headers['x-subdomain'] as string;
    } else if (subdomain) {
      headers['x-subdomain'] = subdomain;
    }
    if (req.headers.cookie) {
      headers.cookie = req.headers.cookie as string;
    }

    // Add instanceId header so master knows which slave is making the request
    if (instanceId) {
      headers['x-onefit-instance-id'] = instanceId;
    }

    // Forward other relevant headers
    if (req.headers['content-type']) {
      headers['content-type'] = req.headers['content-type'] as string;
    }

    // Forward the GraphQL request to master
    const result = await masterClient.request(
      {
        query,
        variables: variables || {},
        operationName,
      },
      headers,
    );
    console.log('masterClient', masterClient);
    console.log('result', result);
    // Return the master's response (including errors if any)
    return res.json(result);
  } catch (error: any) {
    // If proxy fails, return error in GraphQL format
    // return res.status(500).json({
    //   errors: [
    //     {
    //       message: `Failed to proxy request to master: ${error.message}`,
    //       extensions: {
    //         code: 'MASTER_PROXY_ERROR',
    //       },
    //     },
    //   ],
    // });
  }
  return next();
};
