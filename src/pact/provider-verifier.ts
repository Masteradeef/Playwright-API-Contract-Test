import { Verifier, VerifierOptions } from "@pact-foundation/pact";
import path from "path";
import fs from "fs";
import { config } from "../proxy";

export interface ProviderVerifierConfig {
  /** Must match the provider name used in the consumer pact (e.g. "users-service") */
  provider: string;
  /** Base URL of the running provider — e.g. https://jsonplaceholder.typicode.com */
  providerBaseUrl: string;
  /** State handlers keyed by the "given(...)" strings in the consumer tests */
  stateHandlers?: VerifierOptions["stateHandlers"];
  /** Override the resolved pact file path (defaults to pacts/{consumer}-{provider}.json) */
  pactFilePath?: string;
}

/**
 * Creates a Pact Verifier configured to replay a consumer pact against the
 * real provider.  Call `verifier.verifyProvider()` inside the test body.
 *
 * IMPORTANT: consumer tests must be run first so pact files exist in ./pacts/
 */
export function createProviderVerifier(cfg: ProviderVerifierConfig): Verifier {
  const consumer = "web-frontend";
  const pactFile =
    cfg.pactFilePath ??
    path.resolve(
      process.cwd(),
      config.pact.pactDir,
      `${consumer}-${cfg.provider}.json`
    );

  if (!fs.existsSync(pactFile)) {
    throw new Error(
      `Pact file not found: ${pactFile}\n` +
        `Run consumer tests first: npm run test:contract`
    );
  }

  return new Verifier({
    provider: cfg.provider,
    providerBaseUrl: cfg.providerBaseUrl,
    pactUrls: [pactFile],
    stateHandlers: cfg.stateHandlers ?? {},
    logLevel: "warn",
  });
}
