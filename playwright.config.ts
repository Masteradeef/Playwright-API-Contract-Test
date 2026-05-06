import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  retries: 1,
  workers: 4,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "reports/html" }],
    ["json", { outputFile: "reports/results.json" }],
  ],
  use: {
    baseURL: process.env.BASE_URL || "https://jsonplaceholder.typicode.com",
    extraHTTPHeaders: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  },
  projects: [
    {
      name: "schema-validation",
      testMatch: /.*\.schema\.spec\.ts/,
    },
    {
      name: "consumer-contract",
      testMatch: /.*consumer-contract\/.+\.spec\.ts/,
    },
    {
      name: "api-tests",
      testMatch: /.*\.api\.spec\.ts/,
    },
    {
      name: "notes-api",
      testMatch: /.*notes-api\/.+\.spec\.ts/,
      use: {
        baseURL:
          process.env.NOTES_API_BASE_URL ||
          "https://practice.expandtesting.com/notes/api",
      },
    },
    {
      name: "provider-contract",
      testMatch: /.*provider-contract\/.+\.spec\.ts/,
      // Provider verification is a sequential, stateful operation —
      // disable retries and parallelism so Pact output is deterministic.
      retries: 0,
      workers: 1,
    },
  ],
});
