import { test as base } from "@playwright/test";
import { ApiClient } from "../api/api-client";
import { config } from "../config/env.config";
import { LoginUserResponseSchema, validateSchema } from "../proxy";

function generateTestUser() {
  const uid = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  return {
    name: `NoteUser_${uid}`,
    email: `noteuser_${uid}@example.com`,
    password: "TestPass123!",
  };
}

type ApiFixtures = {
  apiClient: ApiClient;
};

type WorkerFixtures = {
  authToken: string;
};

export const test = base.extend<ApiFixtures, WorkerFixtures>({
  apiClient: async ({ request }, use) => {
    const client = new ApiClient(request);
    await use(client);
  },

  authToken: [
    async ({ playwright }, use) => {
      const apiContext = await playwright.request.newContext();
      const user = generateTestUser();

      await apiContext.post(`${config.notesApiBaseUrl}/users/register`, {
        data: { name: user.name, email: user.email, password: user.password },
      });

      const loginRes = await apiContext.post(
        `${config.notesApiBaseUrl}/users/login`,
        { data: { email: user.email, password: user.password } }
      );
      const loginBody = await loginRes.json();
      const parsedLogin = validateSchema(LoginUserResponseSchema, loginBody);

      if (!parsedLogin.success) {
        throw new Error(
          `Failed to authenticate test user: ${JSON.stringify(loginBody)}`
        );
      }

      if (!parsedLogin.data?.data?.token) {
        throw new Error("Failed to authenticate test user: missing token");
      }

      const token = parsedLogin.data.data.token;

      await use(token);

      await apiContext.delete(
        `${config.notesApiBaseUrl}/users/delete-account`,
        { headers: { "x-auth-token": token } }
      );
      await apiContext.dispose();
    },
    { scope: "worker" },
  ],
});

export { expect } from "@playwright/test";
