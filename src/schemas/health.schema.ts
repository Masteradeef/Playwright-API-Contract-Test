import { z } from "zod";

export const HealthCheckResponseSchema = z.object({
  success: z.boolean(),
  status: z.number(),
  message: z.string(),
});

export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;
