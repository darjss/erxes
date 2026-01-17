import { Request, Response, NextFunction } from 'express';
import {
  isSlaveMode,
  getOneFitInstanceId,
  getOneFitSecret,
} from '~/constants/mode';
import { getMasterClient } from '~/utils/masterClient';
import { getSubdomain } from 'erxes-api-shared/utils';

/**
 * List of config queries that should be handled locally in slave mode
 * instead of being proxied to master
 */
const CONFIG_QUERIES = [
  'oneFitMode',
  'oneFitMasterUrl',
  'oneFitSystemConfigs',
  'oneFitSystemConfigsCount',
  'oneFitSystemConfig',
  'oneFitSystemConfigByKey',
  'oneFitAllSystemConfigs',
];

/**
 * Detects if a GraphQL query contains any config-related queries
 * by parsing the query string and checking against the config query list
 */
const isConfigQuery = (query: string, operationName?: string): boolean => {
  // Check operation name first if present
  if (operationName && CONFIG_QUERIES.includes(operationName)) {
    return true;
  }

  // Check for direct field matches in the query string
  // Match the query name as a standalone field (not part of another word)
  for (const configQuery of CONFIG_QUERIES) {
    // Use word boundary to ensure we match the exact field name
    // This handles cases like: query { oneFitMode } or { oneFitMode }
    const regex = new RegExp(`\\b${configQuery}\\b`, 'i');
    if (regex.test(query)) {
      return true;
    }
  }

  return false;
};

/**
 * Middleware that intercepts GraphQL requests in slave mode
 * and forwards them to the master instance
 * Config queries are handled locally instead of being proxied
 */
export const graphqlProxyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Only intercept GraphQL requests
  if (req.path !== '/graphql' || req.method !== 'POST') {
    return next();
  }

  // Only proxy in slave mode
  if (!isSlaveMode()) {
    return next();
  }

  try {
    // Get the GraphQL request body
    const { query, variables, operationName } = req.body;

    if (!query) {
      return next();
    }

    // Check if this is a config query - if so, handle it locally
    if (isConfigQuery(query, operationName)) {
      return next();
    }

    const masterClient = getMasterClient();
    const subdomain = getSubdomain(req);
    const instanceId = getOneFitInstanceId();

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

    // Build cookie string
    const cookies: string[] = [];

    // Add onefitSecret as auth-token cookie
    const onefitSecret = getOneFitSecret();
    if (onefitSecret) {
      cookies.push(`auth-token=${onefitSecret}`);
    }

    // Set combined cookie header
    if (cookies.length > 0) {
      headers.cookie = cookies.join('; ');
    }
    console.log('headers', headers);
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

    // Return the master's response (including errors if any)
    const { data, errors } = result;
    if (errors?.some((error: any) => error.message === 'Login required')) {
      return res.json({
        ...data,
        errors: [
          {
            message: 'INVALID ONEFIT AUTHENTICATION',
          },
        ],
      });
    }
    return res.json(result);
  } catch (error: any) {}
  return next();
};
