import { z } from "zod";

// --- Register ---
export const RegisterUserDataSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

export const RegisterUserResponseSchema = z.object({
  success: z.literal(true),
  status: z.literal(201),
  message: z.string(),
  data: RegisterUserDataSchema,
});

// --- Login ---
export const LoginUserDataSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  token: z.string(),
});

export const LoginUserResponseSchema = z.object({
  success: z.literal(true),
  status: z.literal(200),
  message: z.string(),
  data: LoginUserDataSchema,
});

// --- Profile ---
export const UserProfileDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  company: z.string(),
});

export const UserProfileResponseSchema = z.object({
  success: z.literal(true),
  status: z.literal(200),
  message: z.string(),
  data: UserProfileDataSchema,
});

// --- Generic success (logout, delete-account) ---
export const GenericSuccessResponseSchema = z.object({
  success: z.boolean(),
  status: z.number(),
  message: z.string(),
});

// --- Error ---
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  status: z.number(),
  message: z.string(),
});

export type RegisterUserResponse = z.infer<typeof RegisterUserResponseSchema>;
export type LoginUserResponse = z.infer<typeof LoginUserResponseSchema>;
export type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;
export type GenericSuccessResponse = z.infer<typeof GenericSuccessResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
