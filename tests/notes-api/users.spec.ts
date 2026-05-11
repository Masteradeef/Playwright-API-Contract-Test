import { test, expect, validateSchema, RegisterUserResponseSchema, LoginUserResponseSchema, UserProfileResponseSchema, GenericSuccessResponseSchema, ErrorResponseSchema } from "../../src/proxy";
import type { RegisterUserResponse, LoginUserResponse, UserProfileResponse } from "../../src/proxy";

const BASE_URL = process.env.NOTES_API_BASE_URL || "https://practice.expandtesting.com/notes/api";

//without using fixture - creating and deleting user within each test
function generateTestUser() {
  const uid = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  return {
    name: `TestUser_${uid}`,
    email: `testuser_${uid}@example.com`,
    password: "TestPass123!",
  };
}

test.describe("Users API - Registration @notes-api", () => {
  test("POST /users/register - should create a new user", async ({ apiClient }) => {
    const user = generateTestUser();

    const response = await apiClient.postForm<RegisterUserResponse>(
      `${BASE_URL}/users/register`,
      {
        name: user.name,
        email: user.email,
        password: user.password,
      }
    );

    expect(response.status).toBe(201);

    const result = validateSchema(RegisterUserResponseSchema, response.body);
    expect(result.success).toBe(true);
    expect(result.data?.data.name).toBe(user.name);
    expect(result.data?.data.email).toBe(user.email);
  });

  test("POST /users/register - should fail with missing fields", async ({ apiClient }) => {
    const response = await apiClient.postForm(`${BASE_URL}/users/register`, {
      name: "",
      email: "",
      password: "",
    });

    expect(response.status).toBe(400);

    const result = validateSchema(ErrorResponseSchema, response.body);
    expect(result.success).toBe(true);
    expect(result.data?.success).toBe(false);
  });
});

test.describe("Users API - Login & Profile @notes-api", () => {
  let authToken: string;
  const user = generateTestUser();

  test.beforeAll(async ({ request }) => {
    // Register the test user
    await request.post(`${BASE_URL}/users/register`, {
      data: { name: user.name, email: user.email, password: user.password },
      headers: { "Content-Type": "application/json" },
    });
  });

  test("POST /users/login - should authenticate and return token", async ({ apiClient }) => {
    const response = await apiClient.postForm<LoginUserResponse>(
      `${BASE_URL}/users/login`,
      { email: user.email, password: user.password }
    );

    expect(response.status).toBe(200);

    const result = validateSchema(LoginUserResponseSchema, response.body);
    expect(result.success).toBe(true);
    expect(result.data?.data.token).toBeTruthy();
    expect(result.data?.data.email).toBe(user.email);

    authToken = response.body.data.token;
  });

  test("POST /users/login - should fail with wrong password", async ({ apiClient }) => {
    const response = await apiClient.postForm(`${BASE_URL}/users/login`, {
      email: user.email,
      password: "WrongPassword!",
    });

    expect(response.status).toBe(401);

    const result = validateSchema(ErrorResponseSchema, response.body);
    expect(result.success).toBe(true);
    expect(result.data?.success).toBe(false);
  });

  test("GET /users/profile - should return user profile", async ({ apiClient }) => {
    // Login to get fresh token
    const loginRes = await apiClient.postForm<LoginUserResponse>(
      `${BASE_URL}/users/login`,
      { email: user.email, password: user.password }
    );
    authToken = loginRes.body.data.token;

    const response = await apiClient.get<UserProfileResponse>(
      `${BASE_URL}/users/profile`,
      { headers: { "x-auth-token": authToken } }
    );

    expect(response.status).toBe(200);

    const result = validateSchema(UserProfileResponseSchema, response.body);
    expect(result.success).toBe(true);
    expect(result.data?.data.email).toBe(user.email);
    expect(result.data?.data.name).toBe(user.name);
  });

  test("PATCH /users/profile - should update profile information", async ({ apiClient }) => {
    const loginRes = await apiClient.postForm<LoginUserResponse>(
      `${BASE_URL}/users/login`,
      { email: user.email, password: user.password }
    );
    authToken = loginRes.body.data.token;

    const response = await apiClient.patchForm<UserProfileResponse>(
      `${BASE_URL}/users/profile`,
      { name: user.name, phone: "1234567890", company: "Test Corp" },
      { headers: { "x-auth-token": authToken } }
    );

    expect(response.status).toBe(200);

    const result = validateSchema(UserProfileResponseSchema, response.body);
    expect(result.success).toBe(true);
    expect(result.data?.data.phone).toBe("1234567890");
    expect(result.data?.data.company).toBe("Test Corp");
  });

  test("GET /users/profile - should fail without auth token", async ({ apiClient }) => {
    const response = await apiClient.get(`${BASE_URL}/users/profile`);

    expect(response.status).toBe(401);

    const result = validateSchema(ErrorResponseSchema, response.body);
    expect(result.success).toBe(true);
    expect(result.data?.success).toBe(false);
  });

  test("DELETE /users/delete-account - should delete the user account", async ({ apiClient }) => {
    const loginRes = await apiClient.postForm<LoginUserResponse>(
      `${BASE_URL}/users/login`,
      { email: user.email, password: user.password }
    );
    authToken = loginRes.body.data.token;

    const response = await apiClient.delete(
      `${BASE_URL}/users/delete-account`,
      { headers: { "x-auth-token": authToken } }
    );

    expect(response.status).toBe(200);

    const result = validateSchema(GenericSuccessResponseSchema, response.body);
    expect(result.success).toBe(true);
  });
});
