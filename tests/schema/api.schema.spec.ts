import {
  test,
  expect,
  ApiClient,
  validateSchema,
  validateArraySchema,
  formatValidationErrors,
  UserSchema,
  UsersArraySchema,
  PostSchema,
  PostsArraySchema,
  CommentSchema,
  CommentsArraySchema,
} from "../../src/proxy";

test.describe("Users API - Schema Validation @schema", () => {
  test("GET /users - should match UsersArray schema", async ({ apiClient }) => {
    const response = await apiClient.get("/users");

    expect(response.status).toBe(200);

    const result = validateSchema(UsersArraySchema, response.body);
    if (!result.success) {
      const errors = formatValidationErrors(result.errors!);
      throw new Error(`Schema validation failed:\n${errors.join("\n")}`);
    }
    expect(result.success).toBe(true);
  });

  test("GET /users/:id - should match User schema", async ({ apiClient }) => {
    const response = await apiClient.get("/users/1");

    expect(response.status).toBe(200);

    const result = validateSchema(UserSchema, response.body);
    if (!result.success) {
      const errors = formatValidationErrors(result.errors!);
      throw new Error(`Schema validation failed:\n${errors.join("\n")}`);
    }
    expect(result.success).toBe(true);
    expect(result.data?.id).toBe(1);
  });

  test("GET /users - each user should match User schema individually", async ({
    apiClient,
  }) => {
    const response = await apiClient.get<unknown[]>("/users");

    expect(response.status).toBe(200);

    const { allValid, results } = validateArraySchema(
      UserSchema,
      response.body
    );
    const failedIndices = results
      .map((r, i) => (!r.success ? i : -1))
      .filter((i) => i >= 0);

    if (!allValid) {
      throw new Error(
        `Schema validation failed for users at indices: ${failedIndices.join(", ")}`
      );
    }
    expect(allValid).toBe(true);
  });
});

test.describe("Posts API - Schema Validation @schema", () => {
  test("GET /posts - should match PostsArray schema", async ({ apiClient }) => {
    const response = await apiClient.get("/posts");

    expect(response.status).toBe(200);

    const result = validateSchema(PostsArraySchema, response.body);
    if (!result.success) {
      const errors = formatValidationErrors(result.errors!);
      throw new Error(`Schema validation failed:\n${errors.join("\n")}`);
    }
    expect(result.success).toBe(true);
  });

  test("GET /posts/:id - should match Post schema", async ({ apiClient }) => {
    const response = await apiClient.get("/posts/1");

    expect(response.status).toBe(200);

    const result = validateSchema(PostSchema, response.body);
    if (!result.success) {
      const errors = formatValidationErrors(result.errors!);
      throw new Error(`Schema validation failed:\n${errors.join("\n")}`);
    }
    expect(result.success).toBe(true);
    expect(result.data?.id).toBe(1);
  });
});

test.describe("Comments API - Schema Validation @schema", () => {
  test("GET /comments - should match CommentsArray schema", async ({
    apiClient,
  }) => {
    const response = await apiClient.get("/comments");

    expect(response.status).toBe(200);

    const result = validateSchema(CommentsArraySchema, response.body);
    if (!result.success) {
      const errors = formatValidationErrors(result.errors!);
      throw new Error(`Schema validation failed:\n${errors.join("\n")}`);
    }
    expect(result.success).toBe(true);
  });

  test("GET /posts/:id/comments - should match CommentsArray schema", async ({
    apiClient,
  }) => {
    const response = await apiClient.get("/posts/1/comments");

    expect(response.status).toBe(200);

    const result = validateSchema(CommentsArraySchema, response.body);
    if (!result.success) {
      const errors = formatValidationErrors(result.errors!);
      throw new Error(`Schema validation failed:\n${errors.join("\n")}`);
    }
    expect(result.success).toBe(true);
  });
});
