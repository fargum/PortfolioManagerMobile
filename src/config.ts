import Constants from 'expo-constants';

// Configuration can be overridden via app.json/app.config.ts "extra" field
const extra = Constants.expoConfig?.extra ?? {};

export const API_BASE_URL: string = extra.apiBaseUrl ?? 'http://localhost:8000';
export const DEFAULT_ACCOUNT_ID: number = extra.defaultAccountId ?? 1;

// Request timeout in milliseconds
export const REQUEST_TIMEOUT_MS = 60000;
