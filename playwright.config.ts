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
      name: "contract-tests",
      testMatch: /.*\.contract\.spec\.ts/,
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
  ],
});
