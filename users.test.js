// tests/organisations.test.js
// =============================================
// Organisations API Test Suite
// Tests for organisation management endpoints:
//   • Get organisations
//   • Create organisation
//   • Update organisation
//   • Delete organisation
// =============================================

import { test } from '../src/fixtures/api-fixtures.js';
import { expect } from '../src/api/validators/custom-assertions.js';
import { faker } from '@faker-js/faker';
import {attemptLogin} from "../src/utils/auth.js";

// ── Endpoint constants ────────────────────────────────────
const PROFILE_ENDPOINT = '/profile';
const orgById = (id) => `${ORGS_ENDPOINT}/${id}`;

// ─────────────────────────────────────────────────────────
// Setup: Attempt login before running tests
// ─────────────────────────────────────────────────────────
test.beforeAll(async ({ apiHandler }) => {
  await attemptLogin(apiHandler);
});

// ─────────────────────────────────────────────────────────
// GET /profile
// ─────────────────────────────────────────────────────────
test.describe('GET /profile', () => {
  test('get profile details', async ({ apiHandler }) => {

    const response = await apiHandler
      .get(PROFILE_ENDPOINT, 200);

    const body = await response.json();
    expect(body).toHaveProperty('status', 'success');
    expect(body).toHaveProperty('status_code', 200);
    expect(body).toHaveProperty('message', "User profile retrieved successfully");
    // expect(body).toHaveProperty('data');
    // expect(body.data).toHaveProperty('id');
    // expect(body.data).toHaveProperty('name');
    // expect(body.data.name.toLowerCase()).toBe(newOrg.name.toLowerCase()); // API converts to lowercase
    // expect(body.data).toHaveProperty('description');
    // expect(body.data.description.toLowerCase()).toBe(newOrg.description.toLowerCase()); // API converts to lowercase
    // expect(body.data).toHaveProperty('email');
    // expect(body.data.email.toLowerCase()).toBe(newOrg.email.toLowerCase()); // API converts to lowercase
    // expect(body.data).toHaveProperty('type', newOrg.type);
    // expect(body.data).toHaveProperty('location');
    // expect(body.data.location.toLowerCase()).toBe(newOrg.location.toLowerCase()); // API converts to lowercase
    // expect(body.data).toHaveProperty('country');
    // expect(body.data.country.toLowerCase()).toBe(newOrg.country.toLowerCase()); // API converts to lowercase
    // expect(body.data).toHaveProperty('logo_url', newOrg.logo_url);
    // expect(body.data).toHaveProperty('owner_id');
    // expect(body.data).toHaveProperty('channels_count');
    // expect(body.data).toHaveProperty('total_messages_count');
    // expect(body.data).toHaveProperty('organisation_plan');
  });
});