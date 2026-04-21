// API Client
export { ApiClient } from "./api/api-client";
export type { ApiResponse } from "./api/api-client";

// Config
export { config } from "./config/env.config";

// Data
export { testPosts, testUsers } from "./data/test-data";

// Fixtures
export { test, expect } from "./fixtures/api.fixture";

// Pact
export { createPact } from "./pact/pact-setup";

// Schemas
export { UserSchema, UsersArraySchema, AddressSchema, CompanySchema, GeoSchema } from "./schemas/user.schema";
export type { User, Address, Company } from "./schemas/user.schema";

export { PostSchema, PostsArraySchema, CreatePostSchema } from "./schemas/post.schema";
export type { Post, CreatePost } from "./schemas/post.schema";

export { CommentSchema, CommentsArraySchema } from "./schemas/comment.schema";
export type { Comment } from "./schemas/comment.schema";

// Schemas - Health
export { HealthCheckResponseSchema } from "./schemas/health.schema";
export type { HealthCheckResponse } from "./schemas/health.schema";

// Schemas - User Account
export {
  RegisterUserResponseSchema,
  LoginUserResponseSchema,
  UserProfileResponseSchema,
  GenericSuccessResponseSchema,
  ErrorResponseSchema,
} from "./schemas/user-account.schema";
export type {
  RegisterUserResponse,
  LoginUserResponse,
  UserProfileResponse,
  GenericSuccessResponse,
  ErrorResponse,
} from "./schemas/user-account.schema";

// Schemas - Notes
export {
  NoteCategorySchema,
  NoteDataSchema,
  NoteResponseSchema,
  NotesListResponseSchema,
  NoteDeleteResponseSchema,
} from "./schemas/note.schema";
export type {
  NoteCategory,
  NoteData,
  NoteResponse,
  NotesListResponse,
} from "./schemas/note.schema";

// Utils
export {
  validateSchema,
  validateArraySchema,
  formatValidationErrors,
} from "./utils/schema-validator";
export type { ValidationResult } from "./utils/schema-validator";
