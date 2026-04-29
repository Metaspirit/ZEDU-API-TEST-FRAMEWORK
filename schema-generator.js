// src/utils/auth.js
// ==========================================================
// TokenManager
// Handles login, token storage, auto-refresh, expiry tracking
// ==========================================================

import {request} from '@playwright/test';

class TokenManager {
    static #token = null;
    static #expiresAt = 0;

    // Fetch token from Zedu API
    static async #login() {
        const env = process.env.API_ENV || 'prod';
        const envKey = env.toUpperCase();

        const apiBase = process.env[`${envKey}_BASE_URL`];
        const email = process.env[`${envKey}_EMAIL`];
        const password = process.env[`${envKey}_PASSWORD`];

        if (!apiBase || !email || !password) {
            throw new Error(`Missing ${envKey}_BASE_URL, ${envKey}_EMAIL, or ${envKey}_PASSWORD in .env`);
        }

        const context = await request.newContext();
        const response = await context.post(`${apiBase}/auth/login`, {
            data: {email, password},
            failOnStatusCode: false
        });

        const body = await response.json();
        await context.dispose();

        if (!response.ok()) {
            throw new Error(`Login failed: ${response.status()} - ${JSON.stringify(body)}`);
        }

        const token = body.data?.access_token || body.access_token || body.token;
        const expiresIn = Number(body.data?.access_token_expires_in || body.expires_in) || 3600;

        if (!token) {
            throw new Error('Login succeeded but no token was returned');
        }

        this.setToken(token, expiresIn);
        return token;
    }

    // Store token + expiry
    static setToken(token, expiresIn = 3600) {
        this.#token = token;
        this.#expiresAt = Date.now() + expiresIn * 1000;
    }

    // Check if token is still valid
    static isTokenValid() {
        return this.#token && Date.now() < this.#expiresAt - 30000; // 30s buffer
    }

    // Public method: always returns a valid token
    static async getToken() {
        if (this.isTokenValid()) {
            return this.#token;
        }

        // Token expired or missing → try login first
        try {
            return await this.#login();
        } catch (loginError) {
            // Login failed, throw error with helpful message
            const env = process.env.API_ENV || 'prod';
            const envKey = env.toUpperCase();
            throw new Error(
                `Authentication failed: ${loginError.message}\n` +
                `Please ensure valid credentials are set in environment variables:\n` +
                `  ${envKey}_EMAIL and ${envKey}_PASSWORD`
            );
        }
    }

    // Clear token manually (rarely needed)
    static clearToken() {
        this.#token = null;
        this.#expiresAt = 0;
    }
}

async function attemptLogin(apiHandler) {
    // Try login with environment credentials
    const credentials = {
        email: process.env.PROD_EMAIL || 'test@example.com',
        password: process.env.PROD_PASSWORD || 'testpassword',
    };

    try {
        console.log('Attempting login with environment credentials...');
        const response = await apiHandler
            .unauthorized()
            .post('/auth/login', credentials, 200);

        const body = await response.json();
        if (body.access_token || body.token) {
            // Store token for subsequent requests
            console.log('Successfully logged in');
            return true;
        }
    } catch (error) {
        console.log('Login failed with environment credentials');
        console.log('For a scalable framework, please provide valid credentials in .env file');
        console.log('Set PROD_EMAIL and PROD_PASSWORD to valid user credentials');
    }
    return false;
}


export {TokenManager, attemptLogin};
