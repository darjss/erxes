export type OAuthClientAppType = 'public' | 'confidential';
export type OAuthClientAppStatus = 'active' | 'revoked';
export type OAuthClientAccessTokenLifetime = 'year' | 'half' | 'trio';

export interface IOAuthClientApp {
  _id: string;
  name: string;
  logo?: string;
  description?: string;
  clientId: string;
  type: OAuthClientAppType;
  accessTokenLifetime?: OAuthClientAccessTokenLifetime;
  redirectUrls: string[];
  status: OAuthClientAppStatus;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt?: string;
  generatedSecret?: string;
}

export interface IOAuthClientAppData {
  oauthClientApps: IOAuthClientApp[];
  oauthClientAppsTotalCount: number;
}
