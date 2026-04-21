# Playwright API Contract Test Framework

A scalable and modular Playwright test framework in TypeScript for API test automation, featuring **Zod schema validation** and **Pact consumer-driven contract testing (CDCT)**.

## Project Structure

```
├── src/
│   ├── api/                  # API client wrapper around Playwright requests
│   │   ├── api-client.ts
│   │   └── index.ts
│   ├── config/               # Environment and framework configuration
│   │   ├── env.config.ts
│   │   └── index.ts
│   ├── data/                 # Test data factories
│   │   ├── test-data.ts
│   │   └── index.ts
│   ├── fixtures/             # Playwright custom fixtures
│   │   ├── api.fixture.ts
│   │   └── index.ts
│   ├── pact/                 # Pact setup and helpers
│   │   ├── pact-setup.ts
│   │   └── index.ts
│   ├── schemas/              # Zod schema definitions
│   │   ├── user.schema.ts
│   │   ├── post.schema.ts
│   │   ├── comment.schema.ts
│   │   └── index.ts
│   └── utils/                # Validation utilities
│       ├── schema-validator.ts
│       └── index.ts
├── tests/
│   ├── api/                  # Functional API tests
│   │   └── posts.api.spec.ts
│   ├── contract/             # Pact consumer contract tests
│   │   └── api.contract.spec.ts
│   └── schema/               # Zod schema validation tests
│       └── api.schema.spec.ts
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── env/
│   └── .env.openapi
```

## Setup

```bash
# Install dependencies
npm install

# Copy environment config
cp env/.env.openapi .env
```

## Running Tests

```bash
# Run all tests
npm test

# Run only schema validation tests
npm run test:schema

# Run only Pact contract tests
npm run test:contract

# Run only API functional tests
npm run test:api

# Run by Playwright project
npx playwright test --project=schema-validation
npx playwright test --project=contract-tests
npx playwright test --project=api-tests
```

## Key Concepts

### Schema Validation (Zod)

Zod schemas in `src/schemas/` define the expected shape of API responses. The `validateSchema()` utility parses responses and returns structured results with detailed error messages.

```typescript
import { validateSchema } from "./src/utils";
import { UserSchema } from "./src/schemas";

const result = validateSchema(UserSchema, responseBody);
if (!result.success) {
  console.error(result.errors);
}
```

### Consumer-Driven Contract Testing (Pact)

Pact tests in `tests/contract/` define consumer expectations using PactV4 matchers. When tests run, Pact generates contract files in `pacts/` that can be shared with provider teams.

```typescript
await pact
  .addInteraction()
  .given("a user exists")
  .uponReceiving("a request for the user")
  .withRequest("GET", "/users/1")
  .willRespondWith(200, (builder) => {
    builder.jsonBody(like({ id: integer(1), name: string("Alice") }));
  })
  .executeTest(async (mockServer) => {
    const res = await fetch(`${mockServer.url}/users/1`);
    expect(res.status).toBe(200);
  });
```

### API Client

The `ApiClient` class wraps Playwright's `APIRequestContext` and adds response timing and typed responses:

```typescript
const response = await apiClient.get<User>("/users/1");
// response.status, response.body, response.headers, response.responseTime
```

## Adding New API Endpoints

1. **Define schema** in `src/schemas/` (e.g., `order.schema.ts`)
2. **Export** from `src/schemas/index.ts`
3. **Add schema test** in `tests/schema/`
4. **Add contract test** in `tests/contract/`
5. **Add API test** in `tests/api/`
