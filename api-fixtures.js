// src/config/api.config.js
// =============================================
// Central API Configuration File
// Manages environments, base URLs, auth, and
// project-level settings for the framework.
// =============================================

import { config } from 'dotenv';

// Load the main .env file and .env.example as fallback
config({ path: '.env' });
config({ path: '.env.example', override: false }); // fallback defaults

const env = process.env.API_ENV ?? 'prod';

/**
 * @typedef {Object} EnvironmentConfig
 * @property {string} baseURL        - The base URL for all API requests
 * @property {string} email          - User email for login
 * @property {string} password       - User password for login
 */

/** @type {Record<string, EnvironmentConfig>} */
export const environments = {
  dev: {
    baseURL:  process.env.DEV_BASE_URL  ?? 'https://api.staging.zedu.chat/api/v1',
    email:    process.env.DEV_EMAIL     ?? 'dev@example.com',
    password: process.env.DEV_PASSWORD  ?? 'devpassword',
  },
  staging: {
    baseURL:  process.env.STAGING_BASE_URL  ?? 'https://api.staging.zedu.chat/api/v1',
    email:    process.env.STAGING_EMAIL     ?? 'test@example.com',
    password: process.env.STAGING_PASSWORD  ?? 'test',
  },
  qa: {
    baseURL:  process.env.QA_BASE_URL  ?? 'https://api.staging.zedu.chat/api/v1',
    email:    process.env.QA_EMAIL     ?? 'qa@example.com',
    password: process.env.QA_PASSWORD  ?? 'qapassword',
  },
  prod: {
    baseURL:  process.env.PROD_BASE_URL  ?? 'https://api.zedu.chat/api/v1',
    email:    process.env.PROD_EMAIL     ?? 'prod@example.com',
    password: process.env.PROD_PASSWORD  ?? 'prodpassword',
  },
};

/** Active environment config resolved at runtime */
export const activeEnv = environments[env] ?? environments.dev;

/** Framework-wide API settings */
export const apiConfig = {
  environment:        env,
  baseURL:            activeEnv.baseURL,
  email:              activeEnv.email,
  password:           activeEnv.password,
  authURL:            activeEnv.authURL,
  clientId:           activeEnv.clientId,
  clientSecret:       activeEnv.clientSecret,

  // Timeouts (ms)
  defaultTimeout:     30_000,
  authTimeout:        10_000,

  // Whether every test automatically acquires an access token
  autoAuthorize:      true,

  // HTTP headers added to every request unless overridden
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

  // Schema files live here
  schemaDir: './test-data/schemas',

  // Payloads (request body templates) live here
  payloadDir: './test-data/payloads',
};

export default apiConfig;
