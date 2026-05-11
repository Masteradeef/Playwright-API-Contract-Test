import { test, expect, validateSchema, HealthCheckResponseSchema } from "../../src/proxy";

const BASE_URL = process.env.NOTES_API_BASE_URL || "https://practice.expandtesting.com/notes/api";

test.describe("Health Check API @notes-api", { tag: "@smoke" }, () => {
  test("GET /health-check - should return healthy status", async ({ apiClient }) => {
    const response = await apiClient.get(`${BASE_URL}/health-check`);

    expect(response.status).toBe(200);

    const result = validateSchema(HealthCheckResponseSchema, response.body);
    expect(result.success).toBe(true);
    expect(result.data?.success).toBe(true);
    expect(result.data?.message).toBeTruthy();
  });

  test("GET /health-check - response time should be acceptable", async ({ apiClient }) => {
    const response = await apiClient.get(`${BASE_URL}/health-check`);

    expect(response.status).toBe(200);
    expect(response.responseTime).toBeLessThan(5000);
  });
});
