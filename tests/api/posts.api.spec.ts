import {
  test,
  expect,
  validateSchema,
  PostSchema,
  PostsArraySchema,
  CreatePostSchema,
  testPosts,
} from "../../src/proxy";

test.describe("Posts API - CRUD Operations @api", () => {
  test("GET /posts - should return all posts", async ({ apiClient }) => {
    const response = await apiClient.get("/posts");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    const result = validateSchema(PostsArraySchema, response.body);
    expect(result.success).toBe(true);
  });

  test("GET /posts/:id - should return a single post", async ({ apiClient }) => {
    const response = await apiClient.get("/posts/1");

    expect(response.status).toBe(200);

    const result = validateSchema(PostSchema, response.body);
    expect(result.success).toBe(true);
    expect(result.data?.id).toBe(1);
  });

  test("GET /posts?userId=1 - should filter posts by user", async ({
    apiClient,
  }) => {
    const response = await apiClient.get<Array<{ userId: number }>>("/posts", {
      params: { userId: "1" },
    });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    for (const post of response.body) {
      expect(post.userId).toBe(1);
    }
  });

  test("POST /posts - should create a new post", async ({ apiClient }) => {
    const response = await apiClient.post("/posts", testPosts.validPost);

    expect(response.status).toBe(201);

    const result = validateSchema(CreatePostSchema, response.body);
    expect(result.success).toBe(true);
    expect(result.data?.title).toBe(testPosts.validPost.title);
  });

  test("PUT /posts/:id - should update a post", async ({ apiClient }) => {
    const response = await apiClient.put("/posts/1", testPosts.updatedPost);

    expect(response.status).toBe(200);

    const result = validateSchema(CreatePostSchema, response.body);
    expect(result.success).toBe(true);
    expect(result.data?.title).toBe(testPosts.updatedPost.title);
  });

  test("PATCH /posts/:id - should partially update a post", async ({
    apiClient,
  }) => {
    const response = await apiClient.patch<{ title: string }>(
      "/posts/1",
      testPosts.patchData
    );

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(testPosts.patchData.title);
  });

  test("DELETE /posts/:id - should delete a post", async ({ apiClient }) => {
    const response = await apiClient.delete("/posts/1");

    expect(response.status).toBe(200);
  });

  test("GET /posts/:id - should return 404 for non-existent post", async ({
    apiClient,
  }) => {
    const response = await apiClient.get("/posts/999999");

    expect(response.status).toBe(404);
  });
});

test.describe("Posts API - Response Metadata @api", () => {
  test("GET /posts - response time should be within threshold", async ({
    apiClient,
  }) => {
    const response = await apiClient.get("/posts");

    expect(response.status).toBe(200);
    expect(response.responseTime).toBeLessThan(5000);
  });

  test("GET /posts - should return correct content-type header", async ({
    apiClient,
  }) => {
    const response = await apiClient.get("/posts");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("application/json");
  });
});
