// src/utils/test-data-generator.js
// =============================================
// Test Data Generation
// Provides factory functions for generating
// realistic, random test payloads using Faker.
// Use in data-driven tests and negative cases.
// =============================================

import { faker } from '@faker-js/faker';

// ─── User payloads ────────────────────────────────────────

/**
 * Generate a valid user creation payload.
 * @param {Partial<{name:string,email:string,username:string,phone:string,website:string}>} overrides
 * @returns {object}
 */
export function generateUser(overrides = {}) {
  return {
    name:     faker.person.fullName(),
    username: faker.internet.userName(),
    email:    faker.internet.email(),
    phone:    faker.phone.number(),
    website:  faker.internet.url(),
    address: {
      street:  faker.location.streetAddress(),
      suite:   faker.location.secondaryAddress(),
      city:    faker.location.city(),
      zipcode: faker.location.zipCode(),
      geo: {
        lat: faker.location.latitude().toString(),
        lng: faker.location.longitude().toString(),
      },
    },
    company: {
      name:        faker.company.name(),
      catchPhrase: faker.company.catchPhrase(),
      bs:          faker.company.buzzPhrase(),
    },
    ...overrides,
  };
}

// ─── Post payloads ────────────────────────────────────────

/**
 * Generate a valid post creation payload.
 * @param {Partial<{userId:number,title:string,body:string}>} overrides
 * @returns {object}
 */
export function generatePost(overrides = {}) {
  return {
    userId: faker.number.int({ min: 1, max: 10 }),
    title:  faker.lorem.sentence(),
    body:   faker.lorem.paragraphs(2),
    ...overrides,
  };
}

// ─── Comment payloads ────────────────────────────────────

export function generateComment(overrides = {}) {
  return {
    postId: faker.number.int({ min: 1, max: 100 }),
    name:   faker.lorem.sentence(),
    email:  faker.internet.email(),
    body:   faker.lorem.paragraph(),
    ...overrides,
  };
}

// ─── Invalid / negative payloads ─────────────────────────

/**
 * Returns a set of invalid user payloads for negative test cases.
 * Each entry describes what is wrong.
 * @returns {Array<{description: string, payload: object, expectedStatus: number}>}
 */
export function generateInvalidUserCases() {
  return [
    {
      description:    'missing required name field',
      payload:        { email: faker.internet.email() },
      expectedStatus: 400,
    },
    {
      description:    'invalid email format',
      payload:        { name: faker.person.fullName(), email: 'not-an-email' },
      expectedStatus: 400,
    },
    {
      description:    'empty body',
      payload:        {},
      expectedStatus: 400,
    },
    {
      description:    'name is a number (wrong type)',
      payload:        { name: 12345, email: faker.internet.email() },
      expectedStatus: 400,
    },
  ];
}

// ─── Dataset builder ─────────────────────────────────────

/**
 * Generate an array of n items using a factory function.
 * @template T
 * @param {(index: number) => T} factory
 * @param {number}               count
 * @returns {T[]}
 */
export function generateMany(factory, count) {
  return Array.from({ length: count }, (_, i) => factory(i));
}
