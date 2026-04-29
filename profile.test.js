// tests/auth.test.js
// =============================================
// Auth API Test Suite
// Tests for authentication endpoints:
//   • Register
//   • Login
//   • Logout
//   • Password reset
//   • Magic link
// =============================================

import { test } from '../src/fixtures/api-fixtures.js';
import { expect } from '../src/api/validators/custom-assertions.js';
import { faker } from '@faker-js/faker';

// ── Endpoint constants ────────────────────────────────────
const AUTH_ENDPOINT = '/auth';

// ─────────────────────────────────────────────────────────
// POST /auth/register (Run first - no auth required)
// ─────────────────────────────────────────────────────────
test.describe('POST /auth/register', () => {
  test('should register a new user successfully', async ({ apiHandler }) => {
    const newUser = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
    };

    const response = await apiHandler
      .unauthorized()
      .post(`${AUTH_ENDPOINT}/register`, newUser, 201);

    const body = await response.json();
    expect(body).toHaveProperty('status', 'success');
    expect(body).toHaveProperty('status_code', 201);
    expect(body).toHaveProperty('message', 'User Created Successfully');
    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('access_token');
    expect(body.data).toHaveProperty('notification_token');
    expect(body.data).toHaveProperty('user');
    expect(body.data.user).toHaveProperty('email');
    expect(body.data.user.email).toBe(newUser.email.toLowerCase()); // API normalizes email to lowercase
  });

  test('should return 400 for missing required fields', async ({ apiHandler }) => {
    const invalidUser = {
      email: faker.internet.email(),
      // missing password
    };

    const response = await apiHandler
      .unauthorized()
      .post(`${AUTH_ENDPOINT}/register`, invalidUser, 400);

    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('should return 400 for invalid email format', async ({ apiHandler }) => {
    const invalidUser = {
      email: 'invalid-email',
      password: faker.internet.password(),
    };

    const response = await apiHandler
      .unauthorized()
      .post(`${AUTH_ENDPOINT}/register`, invalidUser, 400);

    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('should return 409 for existing email', async ({ apiHandler }) => {
    const existingEmail = 'existing@example.com'; // assume this exists
    const newUser = {
      email: existingEmail,
      password: faker.internet.password(),
    };

    const response = await apiHandler
      .unauthorized()
      .post(`${AUTH_ENDPOINT}/register`, newUser, 409);

    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  // Edge case: very long email
  test('should handle very long email address', async ({ apiHandler }) => {
    const longEmail = 'a'.repeat(200) + '@example.com';
    const newUser = {
      email: longEmail,
      password: faker.internet.password(),
    };

    const response = await apiHandler
      .unauthorized()
      .post(`${AUTH_ENDPOINT}/register`, newUser, 400); // assuming validation

    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});

// ─────────────────────────────────────────────────────────
// POST /auth/login (Run after register)
// ─────────────────────────────────────────────────────────
test.describe('POST /auth/login', () => {
  test('should login successfully with valid credentials', async ({ apiHandler }) => {
    const credentials = {
      email: process.env.PROD_EMAIL || 'test@example.com',
      password: process.env.PROD_PASSWORD || 'testpassword',
    };

    const response = await apiHandler
      .unauthorized()
      .post(`${AUTH_ENDPOINT}/login`, credentials, 200);

    const body = await response.json();
    expect(body).toHaveProperty('access_token');
    expect(body).toHaveProperty('token_type', 'Bearer');
  });

  test('should return 401 for invalid credentials', async ({ apiHandler }) => {
    const invalidCredentials = {
      email: 'invalid@example.com',
      password: 'wrongpassword',
    };

    const response = await apiHandler
      .unauthorized()
      .post(`${AUTH_ENDPOINT}/login`, invalidCredentials, 401);

    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('should return 400 for missing email', async ({ apiHandler }) => {
    const credentials = {
      password: 'password',
    };

    const response = await apiHandler
      .unauthorized()
      .post(`${AUTH_ENDPOINT}/login`, credentials, 400);

    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('should return 400 for missing password', async ({ apiHandler }) => {
    const credentials = {
      email: 'test@example.com',
    };

    const response = await apiHandler
      .unauthorized()
      .post(`${AUTH_ENDPOINT}/login`, credentials, 400);

    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  // Edge case: SQL injection attempt
  test('should handle SQL injection attempts', async ({ apiHandler }) => {
    const maliciousCredentials = {
      email: "' OR '1'='1",
      password: "' OR '1'='1",
    };

    const response = await apiHandler
      .unauthorized()
      .post(`${AUTH_ENDPOINT}/login`, maliciousCredentials, 401);

    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});

// ─────────────────────────────────────────────────────────
// POST /auth/logout
// ─────────────────────────────────────────────────────────
test.describe('POST /auth/logout', () => {
  test('should logout successfully', async ({ apiHandler }) => {
    const response = await apiHandler
      .post(`${AUTH_ENDPOINT}/logout`, {}, 200);

    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  test('should return 401 for unauthorized logout', async ({ apiHandler }) => {
    const response = await apiHandler
      .unauthorized()
      .post(`${AUTH_ENDPOINT}/logout`, {}, 401);

    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});

// ─────────────────────────────────────────────────────────
// POST /auth/password-reset
// ─────────────────────────────────────────────────────────
test.describe('POST /auth/password-reset', () => {
  test('should request password reset successfully', async ({ apiHandler }) => {
    const resetRequest = {
      email: faker.internet.email(),
    };

    const response = await apiHandler
      .unauthorized()
      .post(`${AUTH_ENDPOINT}/password-reset`, resetRequest, 200);

    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  test('should return 400 for invalid email', async ({ apiHandler }) => {
    const resetRequest = {
      email: 'invalid-email',
    };

    const response = await apiHandler
      .unauthorized()
      .post(`${AUTH_ENDPOINT}/password-reset`, resetRequest, 400);

    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});

// ─────────────────────────────────────────────────────────
// POST /auth/magick-link
// ─────────────────────────────────────────────────────────
test.describe('POST /auth/magick-link', () => {
  test('should request magic link successfully', async ({ apiHandler }) => {
    const magicRequest = {
      email: faker.internet.email(),
    };

    const response = await apiHandler
      .unauthorized()
      .post(`${AUTH_ENDPOINT}/magick-link`, magicRequest, 200);

    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  test('should return 400 for invalid email', async ({ apiHandler }) => {
    const magicRequest = {
      email: 'invalid-email',
    };

    const response = await apiHandler
      .unauthorized()
      .post(`${AUTH_ENDPOINT}/magick-link`, magicRequest, 400);

    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});