// tests/users.test.js
// =============================================
// Users API Test Suite
// Tests for user management endpoints:
//   • Get users
//   • Get user by ID
//   • Update user
//   • Delete user
// =============================================

import {test} from '../src/index.js';
import {expect} from '../src/index.js';
import {faker} from '@faker-js/faker';
import {attemptLogin} from '../src/utils/auth.js';

// ── Endpoint constants ────────────────────────────────────
const USERS_ENDPOINT = '/users';
const userById = (id) => `${USERS_ENDPOINT}/${id}`;

// ── Authentication helper ────────────────────────────────
// async function attemptLogin(apiHandler) {
//     // Try login with environment credentials
//     const credentials = {
//         email: process.env.PROD_EMAIL || 'test@example.com',
//         password: process.env.PROD_PASSWORD || 'testpassword',
//     };
//
//     try {
//         console.log('Attempting login with environment credentials...');
//         const response = await apiHandler
//             .unauthorized()
//             .post('/auth/login', credentials, 200);
//
//         const body = await response.json();
//         if (body.access_token || body.token) {
//             // Store token for subsequent requests
//             console.log('Successfully logged in');
//             return true;
//         }
//     } catch (error) {
//         console.log('Login failed with environment credentials');
//         console.log('For a scalable framework, please provide valid credentials in .env file');
//         console.log('Set PROD_EMAIL and PROD_PASSWORD to valid user credentials');
//     }
//     return false;
// }

// ─────────────────────────────────────────────────────────
// Setup: Attempt login before running tests
// ─────────────────────────────────────────────────────────
test.beforeAll(async ({apiHandler}) => {
    await attemptLogin(apiHandler);
});

// ─────────────────────────────────────────────────────────
// GET /users
// ─────────────────────────────────────────────────────────
test.describe('GET /users', () => {
    test('should return list of users', async ({apiHandler}) => {
        const response = await apiHandler.get(USERS_ENDPOINT);
        const body = await response.json();

        expect(Array.isArray(body)).toBe(true);
    });

    test('should support pagination', async ({apiHandler}) => {
        const response = await apiHandler
            .withQuery('page', 1)
            .withQuery('limit', 10)
            .get(USERS_ENDPOINT);

        const body = await response.json();
        expect(body).toHaveProperty('data');
        expect(Array.isArray(body.data)).toBe(true);
    });

    test('should filter by search query', async ({apiHandler}) => {
        const response = await apiHandler
            .withQuery('search', 'john')
            .get(USERS_ENDPOINT);

        const body = await response.json();
        expect(Array.isArray(body)).toBe(true);
    });

    // Negative: invalid query param
    test('should return 400 for invalid limit', async ({apiHandler}) => {
        const response = await apiHandler
            .withQuery('limit', 'invalid')
            .get(USERS_ENDPOINT, 400);

        const body = await response.json();
        expect(body).toHaveProperty('error');
    });

    // Edge case: very large limit
    test('should handle large limit gracefully', async ({apiHandler}) => {
        const response = await apiHandler
            .withQuery('limit', 10000)
            .get(USERS_ENDPOINT, 400); // assuming validation

        const body = await response.json();
        expect(body).toHaveProperty('error');
    });
});

// ─────────────────────────────────────────────────────────
// GET /users/:id
// ─────────────────────────────────────────────────────────
test.describe('GET /users/:id', () => {
    test('should return single user', async ({apiHandler}) => {
        // Assume user ID 1 exists
        const response = await apiHandler.get(userById(1));
        const body = await response.json();

        expect(body).toHaveProperty('id', 1);
        expect(body).toHaveProperty('email');
    });

    test('should return 404 for non-existent user', async ({apiHandler}) => {
        const response = await apiHandler.get(userById(99999), 404);
        const body = await response.json();

        expect(body).toHaveProperty('error');
    });

    // Negative: invalid ID
    test('should return 400 for invalid ID', async ({apiHandler}) => {
        const response = await apiHandler.get(userById('invalid'), 400);
        const body = await response.json();

        expect(body).toHaveProperty('error');
    });

    // Edge case: very large ID
    test('should handle very large ID', async ({apiHandler}) => {
        const response = await apiHandler.get(userById(999999999), 404);
        const body = await response.json();

        expect(body).toHaveProperty('error');
    });
});

// ─────────────────────────────────────────────────────────
// PUT /users/:id
// ─────────────────────────────────────────────────────────
test.describe('PUT /users/:id', () => {
    test('should update user successfully', async ({apiHandler}) => {
        const updateData = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
        };

        const response = await apiHandler
            .withBody(updateData)
            .put(userById(1), 200);

        const body = await response.json();
        expect(body).toHaveProperty('id', 1);
        expect(body.first_name).toBe(updateData.first_name);
    });

    test('should return 404 for non-existent user', async ({apiHandler}) => {
        const updateData = {
            first_name: 'Updated',
        };

        const response = await apiHandler
            .withBody(updateData)
            .put(userById(99999), 404);

        const body = await response.json();
        expect(body).toHaveProperty('error');
    });

    // Negative: invalid data
    test('should return 400 for invalid email', async ({apiHandler}) => {
        const updateData = {
            email: 'invalid-email',
        };

        const response = await apiHandler
            .withBody(updateData)
            .put(userById(1), 400);

        const body = await response.json();
        expect(body).toHaveProperty('error');
    });

    // Edge case: empty update
    test('should handle empty update body', async ({apiHandler}) => {
        const response = await apiHandler
            .withBody({})
            .put(userById(1), 200);

        const body = await response.json();
        expect(body).toHaveProperty('id', 1);
    });
});

// ─────────────────────────────────────────────────────────
// DELETE /users/:id
// ─────────────────────────────────────────────────────────
test.describe('DELETE /users/:id', () => {
    test('should delete user successfully', async ({apiHandler}) => {
        // Assume we can delete a test user
        const response = await apiHandler.delete(userById(2), 200);
        const body = await response.json();

        expect(body).toHaveProperty('message');
    });

    test('should return 404 for non-existent user', async ({apiHandler}) => {
        const response = await apiHandler.delete(userById(99999), 404);
        const body = await response.json();

        expect(body).toHaveProperty('error');
    });

    // Negative: delete own user
    test('should return 403 for deleting own user', async ({apiHandler}) => {
        const response = await apiHandler.delete(userById(1), 403);
        const body = await response.json();

        expect(body).toHaveProperty('error');
    });

    // Edge case: delete with query params
    test('should ignore query params on delete', async ({apiHandler}) => {
        const response = await apiHandler
            .withQuery('force', 'true')
            .delete(userById(3), 200);

        const body = await response.json();
        expect(body).toHaveProperty('message');
    });
});