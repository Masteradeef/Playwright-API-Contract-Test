import { z } from "zod";

export const CommentSchema = z.object({
  postId: z.number().int().positive(),
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.string().email(),
  body: z.string().min(1),
});

export const CommentsArraySchema = z.array(CommentSchema);

export type Comment = z.infer<typeof CommentSchema>;
