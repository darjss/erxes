import fetch from 'node-fetch';
import FormData from 'form-data';
import * as fs from 'fs';
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

export interface FileUploadOptions {
  filePath: string;
  fileName: string;
  mimetype: string;
  maxHeight?: number;
  maxWidth?: number;
  kind?: string;
}

export class MasterClient {
  private masterUrl: string;
  private graphqlEndpoint: string;
  private uploadEndpoint: string;

  constructor(masterUrl: string) {
    this.masterUrl = masterUrl.replace(/\/$/, '');
    this.graphqlEndpoint = `${this.masterUrl}/graphql`;
    // Upload endpoint should go through gateway to onefit_api plugin
    this.uploadEndpoint = `${this.masterUrl}/gateway/pl:onefit/upload-file`;
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

  async uploadFile(
    options: FileUploadOptions,
    headers?: Record<string, string>,
  ): Promise<string> {
    try {
      if (!fs.existsSync(options.filePath)) {
        throw new Error(`File not found: ${options.filePath}`);
      }

      const formData = new FormData();
      formData.append('file', fs.createReadStream(options.filePath), {
        filename: options.fileName,
        contentType: options.mimetype,
      });

      const queryParams = new URLSearchParams();
      if (options.kind) {
        queryParams.append('kind', options.kind);
      }
      if (options.maxHeight) {
        queryParams.append('maxHeight', options.maxHeight.toString());
      }
      if (options.maxWidth) {
        queryParams.append('maxWidth', options.maxWidth.toString());
      }

      const url = `${this.uploadEndpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...formData.getHeaders(),
          ...headers,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Master upload failed: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }

      const result = await response.text();
      return result;
    } catch (error: any) {
      throw new Error(
        `Failed to upload file to master: ${error.message}`,
      );
    }
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
