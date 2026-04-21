import { test as base } from "@playwright/test";
import { ApiClient } from "../api/api-client";

type ApiFixtures = {
  apiClient: ApiClient;
};

export const test = base.extend<ApiFixtures>({
  apiClient: async ({ request }, use) => {
    const client = new ApiClient(request);
    await use(client);
  },
});

export { expect } from "@playwright/test";
