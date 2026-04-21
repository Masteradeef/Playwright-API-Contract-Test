import { z } from "zod";

export const PostSchema = z.object({
  userId: z.number().int().positive(),
  id: z.number().int().positive(),
  title: z.string().min(1),
  body: z.string().min(1),
});

export const PostsArraySchema = z.array(PostSchema);

export const CreatePostSchema = z.object({
  userId: z.number().int().positive(),
  id: z.number().int(),
  title: z.string().min(1),
  body: z.string().min(1),
});

export type Post = z.infer<typeof PostSchema>;
export type CreatePost = z.infer<typeof CreatePostSchema>;
