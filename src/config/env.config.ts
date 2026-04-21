import dotenv from "dotenv";

dotenv.config();

export const config = {
  baseUrl: process.env.BASE_URL || "https://jsonplaceholder.typicode.com",
  notesApiBaseUrl:
    process.env.NOTES_API_BASE_URL ||
    "https://practice.expandtesting.com/notes/api",
  pact: {
    consumerName: process.env.PACT_CONSUMER || "api-consumer",
    providerName: process.env.PACT_PROVIDER || "api-provider",
    pactBrokerUrl: process.env.PACT_BROKER_URL || "http://localhost:9292",
    pactDir: "./pacts",
    logDir: "./pact-logs",
  },
  timeouts: {
    request: 10_000,
    test: 30_000,
  },
} as const;
