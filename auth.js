// src/index.js
// =============================================
// Barrel Export
// Import everything the framework exposes from
// a single entry point for convenience.
// =============================================

// Core
export {RequestHandler} from './api/handlers/request-handler.js';
export {UrlBuilder} from './api/builders/url-builder.js';
export {AuthHelper} from './api/auth/auth-helper.js';

// Validators
export {
    StatusCodeValidator,
    StatusCodeError
} from './api/validators/status-code-validator.js';
export {expect} from './api/validators/custom-assertions.js';

// Fixtures
export {test} from './fixtures/api-fixtures.js';

// Utils
export {CustomLogger} from './utils/logger/custom-logger.js';
export {
    SchemaValidator,
    SchemaValidationError
} from './utils/schema/schema-validator.js';
export {
    generateUser,
    generatePost,
    generateComment,
    generateInvalidUserCases,
    generateMany
} from './utils/test-data-generator.js';

// Config
export {
    apiConfig,
    environments,
    activeEnv
} from './config/api.config.js';
