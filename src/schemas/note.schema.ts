import { z } from "zod";

export const NoteCategorySchema = z.enum(["Home", "Work", "Personal"]);

export const NoteDataSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  category: NoteCategorySchema,
  completed: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  user_id: z.string(),
});

export const NoteResponseSchema = z.object({
  success: z.literal(true),
  status: z.number(),
  message: z.string(),
  data: NoteDataSchema,
});

export const NotesListResponseSchema = z.object({
  success: z.literal(true),
  status: z.number(),
  message: z.string(),
  data: z.array(NoteDataSchema),
});

export const NoteDeleteResponseSchema = z.object({
  success: z.boolean(),
  status: z.number(),
  message: z.string(),
});

export type NoteCategory = z.infer<typeof NoteCategorySchema>;
export type NoteData = z.infer<typeof NoteDataSchema>;
export type NoteResponse = z.infer<typeof NoteResponseSchema>;
export type NotesListResponse = z.infer<typeof NotesListResponseSchema>;
