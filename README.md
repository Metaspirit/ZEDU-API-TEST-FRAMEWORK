# 🚀 Zedu API Automation Test Suite

**Automated API Testing Framework (JavaScript • Playwright • Dotenv)**

This repository contains a fully structured, maintainable, and scalable API automation framework built for testing the Zedu Platform API.  
It uses clean engineering practices, dynamic authentication, and robust test design.

---

## 📌 Objectives of This Project

This project demonstrates:

- A clean, modular API automation framework  
- Programmatic authentication (no hardcoded tokens)  
- Dynamic test data generation  
- Independent, idempotent, repeatable tests  
- Meaningful assertions beyond status codes  
- Clear separation of concerns (utils, tests, config)  
- **25+ automated tests** (positive, negative, edge cases)  

---

## 🏗️ Complete Project Structure

```
zedu-api-tests/
│
├── .env                          # Environment variables (submitted for evaluation)
├── .env.example                  # Example environment configuration
├── .gitignore                    # Git ignore rules
├── README.md                     # Project documentation
├── package.json                  # Node.js dependencies and scripts
├── package-lock.json             # Dependency lock file
├── playwright.config.js          # Playwright test configuration
│
├── src/
│   ├── index.js                  # Main entry point
│   ├── .DS_Store                 # macOS system file
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── auth-helper.js    # Authentication logic and token management
│   │   ├── builders/
│   │   │   └── url-builder.js    # URL construction utilities
│   │   ├── handlers/
│   │   │   └── request-handler.js # HTTP request handling
│   │   └── validators/
│   │       ├── custom-assertions.js # Custom test assertions
│   │       └── status-code-validator.js # Status code validation
│   │
│   ├── config/
│   │   └── api.config.js         # Environment and API configuration
│   │
│   ├── fixtures/
│   │   ├── api-fixtures.js       # Playwright test fixtures
│   │   └── assertion-fixtures.js # Assertion fixtures
│   │
│   └── utils/
│       ├── auth.js               # TokenManager utility
│       ├── test-data-generator.js # Test data generation
│       ├── logger/
│       │   └── custom-logger.js  # Custom logging utility
│       └── schema/
│           └── schema-validator.js # JSON schema validation
│
├── test-data/
│   ├── payloads/
│   │   └── create-post.json      # Test payload data
│   └── schemas/
│       ├── post-response.json    # Response schema validation
│       ├── user-response.json    # User response schema
│       └── user-response-generated.json # Generated schema
│
├── tests/
│   ├── auth.test.js              # Authentication API tests
│   ├── users.test.js             # User management API tests
│   ├── organisations.test.js     # Organisation API tests
│   └── example.spec.js           # Example test file
│
├── .idea/                        # IntelliJ IDEA configuration
│   ├── .gitignore
│   ├── modules.xml
│   ├── vcs.xml
│   ├── workspace.xml
│   └── zedu-api-tests.iml
│
├── node_modules/                 # Dependencies (not committed)
├── reports/                      # Test reports (generated)
└── test-results/                 # Test results (generated)
```
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/zedu-api-tests.git
   cd zedu-api-tests
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the credentials in `.env` with valid test credentials

4. Run the tests:
   ```bash
   # Run all tests
   npm run test:all

   # Run API tests
   npm run test:api

   # Run in specific environment
   npm run test:prod
   ```

---

## 🔧 Configuration

### Environment Variables

The project uses environment variables for configuration. Key variables:

- `API_ENV`: Environment to run tests in (dev, qa, prod)
- `PROD_BASE_URL`: Production API base URL
- `PROD_EMAIL`: Test user email for production
- `PROD_PASSWORD`: Test user password for production

### Test Environments

- **Production**: `https://api.zedu.chat/api/v1`
- **Staging**: `https://api.staging.zedu.chat/api/v1`
- **Development**: `http://localhost:8019/api/v1`

---

## 🧪 Test Coverage

### Authentication Tests (`auth.test.js`)
- User registration (positive & negative cases)
- User login (valid/invalid credentials)
- Password reset requests
- Magic link requests
- Logout functionality

### User Management Tests (`users.test.js`)
- List users with pagination
- Get single user by ID
- Update user information
- Delete users
- Error handling for invalid operations

### Organisation Tests (`organisations.test.js`)
- List organisations
- Create new organisations
- Update organisation details
- Delete organisations
- Permission and validation checks

### Test Statistics
- **Total Tests**: 25+
- **Negative Tests**: 10+
- **Edge Cases**: 5+

---

## 🔐 Authentication Flow

The framework implements a robust authentication system that leverages API registration tokens:

### **Test Execution Order**
1. **Register Tests** - Run first (no authentication required), validate registration response structure
2. **Protected Endpoints** - Attempt login with environment credentials, use tokens for authenticated requests
3. **Graceful Degradation** - Tests continue without auth if credentials are invalid

### **Authentication Strategy**
- **Login-First**: Tests attempt login with environment credentials first
- **Token Caching**: JWT tokens cached via `TokenManager` for session reuse
- **Auto-Authorization**: `autoAuthorize: true` enables automatic Bearer token injection
- **Scalable Design**: No user registration during tests - uses existing credentials
- **Clear Error Messages**: Helpful guidance when credentials are invalid

### **Test Structure**
```javascript
// Auth tests validate API responses
test.describe('POST /auth/register', () => {
  // Expects: { status, status_code: 201, message, data: { access_token, user } }
});

// Protected endpoints attempt login first
test.beforeAll(async ({ apiHandler }) => {
  await attemptLogin(apiHandler); // Login with env credentials
});

// Tests use cached tokens automatically
test('should access protected endpoint', async ({ apiHandler }) => {
  const response = await apiHandler.get('/users/me'); // Token injected automatically
});
```

### **Token Management**
- **Login Response**: `POST /auth/login` returns `access_token`
- **Token Storage**: JWT tokens cached with expiration via `TokenManager`
- **Environment Credentials**: Uses `PROD_EMAIL` and `PROD_PASSWORD` from `.env`
- **Request Flow**: `login → cache token → auto-inject Bearer header`
- **API Compatibility**: Works with Zedu API's UUID-based user identification

### **Environment Variables**
```env
API_ENV=prod
PROD_BASE_URL=https://api.zedu.chat/api/v1
PROD_EMAIL=your-valid-email@example.com
PROD_PASSWORD=your-valid-password
```

## ✅ Implementation Status

### **Completed Features**
- ✅ **API Registration with Token Response**: `POST /auth/register` returns access tokens
- ✅ **Automatic Token Caching**: Tokens from registration stored via `TokenManager`
- ✅ **Authentication Flow**: Register-first, login-fallback strategy
- ✅ **Auto-Authorization**: `autoAuthorize: true` enables automatic Bearer token injection
- ✅ **Test Structure**: Auth tests run first, protected endpoints use cached tokens
- ✅ **Response Validation**: Tests validate correct API response structure
- ✅ **Error Handling**: Graceful fallback when registration/login fails

### **Test Results**
```bash
✓ POST /auth/register › should register a new user successfully
✓ Authentication tokens automatically injected into requests
✓ API accepts Bearer tokens from registration
✓ Tests handle UUID-based user IDs correctly
```

### **Key Implementation Details**
- **Registration Response**: `{ status, status_code: 201, message, data: { access_token, user } }`
- **Token Storage**: JWT tokens cached with expiration via `TokenManager`
- **Request Flow**: `register → cache token → auto-inject Bearer header`
- **Fallback Strategy**: Register new user → fallback to login existing user
- **API Compatibility**: Works with Zedu API's UUID-based user identification

## 📊 Reporting

Test results are generated using Playwright's built-in reporting:

```bash
# View test report
npm run report
```

Reports include:
- Test execution summary
- Detailed logs for each test
- Screenshots and traces for failures
- Performance metrics

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

---

## 📄 License

This project is licensed under the ISC License.
