export const DEVICE_CODE_EXPIRES_IN = 10 * 60;
export const DEVICE_POLL_INTERVAL = 5;

// public  (CLI / device flow) — long-lived
export const ACCESS_TOKEN_EXPIRES_IN_PUBLIC = 8 * 60 * 60; // 8h
export const REFRESH_TOKEN_EXPIRES_IN_PUBLIC = 90 * 24 * 60 * 60; // 90d

// confidential (server-side apps) — selectable access-token lifetime
export const ACCESS_TOKEN_EXPIRES_IN_CONFIDENTIAL_YEAR = 60 * 60 * 24 * 365; // 1y
export const ACCESS_TOKEN_EXPIRES_IN_CONFIDENTIAL_HALF = 60 * 60 * 24 * 30 * 6; // 6mo
export const ACCESS_TOKEN_EXPIRES_IN_CONFIDENTIAL_TRIO = 60 * 60 * 24 * 30 * 3; // 3mo
export const ACCESS_TOKEN_EXPIRES_IN_CONFIDENTIAL =
  ACCESS_TOKEN_EXPIRES_IN_CONFIDENTIAL_YEAR;

export const getConfidentialAccessTokenExpiresIn = (
  lifetime?: 'year' | 'half' | 'trio',
) => {
  switch (lifetime) {
    case 'half':
      return ACCESS_TOKEN_EXPIRES_IN_CONFIDENTIAL_HALF;
    case 'trio':
      return ACCESS_TOKEN_EXPIRES_IN_CONFIDENTIAL_TRIO;
    case 'year':
    default:
      return ACCESS_TOKEN_EXPIRES_IN_CONFIDENTIAL_YEAR;
  }
};

export const REFRESH_TOKEN_EXPIRES_IN_CONFIDENTIAL = 30 * 24 * 60 * 60; // 30d

// backward-compat alias (gateway userMiddleware-д ашиглагдаж болно)
export const ACCESS_TOKEN_EXPIRES_IN = ACCESS_TOKEN_EXPIRES_IN_CONFIDENTIAL;
export const DEVICE_CODE_GRANT = 'urn:ietf:params:oauth:grant-type:device_code';
export const MAX_DEVICE_CODE_FAILED_ATTEMPTS = 5;
