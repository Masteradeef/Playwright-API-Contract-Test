import { PactV4, LogLevel } from "@pact-foundation/pact";
import path from "path";
import { config } from "../proxy";

export function createPact(consumer: string, provider: string): PactV4 {
  return new PactV4({
    consumer,
    provider,
    dir: path.resolve(process.cwd(), config.pact.pactDir),
    logLevel: "warn" as LogLevel,
  });
}
