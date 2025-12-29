import fetch from 'node-fetch';
import { getOneFitMasterUrl } from '~/constants/mode';

export interface GraphQLRequest {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
}

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    path?: string[];
    extensions?: Record<string, any>;
  }>;
}

export class MasterClient {
  private masterUrl: string;
  private graphqlEndpoint: string;

  constructor(masterUrl: string) {
    this.masterUrl = masterUrl.replace(/\/$/, '');
    this.graphqlEndpoint = `${this.masterUrl}/graphql`;
  }

  async request<T = any>(
    request: GraphQLRequest,
    headers?: Record<string, string>,
  ): Promise<GraphQLResponse<T>> {
    try {
      const response = await fetch(this.graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(
          `Master API request failed: ${response.status} ${response.statusText}`,
        );
      }

      const result = (await response.json()) as GraphQLResponse<T>;

      // Don't throw on GraphQL errors, return them so they can be handled properly
      return result;
    } catch (error: any) {
      throw new Error(
        `Failed to communicate with master API: ${error.message}`,
      );
    }
  }

  async query<T = any>(
    query: string,
    variables?: Record<string, any>,
    headers?: Record<string, string>,
  ): Promise<T> {
    const response = await this.request<T>({ query, variables }, headers);
    return response.data as T;
  }

  async mutate<T = any>(
    mutation: string,
    variables?: Record<string, any>,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.query<T>(mutation, variables, headers);
  }
}

let masterClientInstance: MasterClient | null = null;

export const getMasterClient = (): MasterClient => {
  if (!masterClientInstance) {
    const masterUrl = getOneFitMasterUrl();
    if (!masterUrl) {
      throw new Error('Master URL is not configured');
    }
    masterClientInstance = new MasterClient(masterUrl);
  }
  return masterClientInstance;
};

export const resetMasterClient = (): void => {
  masterClientInstance = null;
};
