import { z } from 'zod';

export const postSchema = z.object({
  id: z.number(),
  message: z.string().min(1),
  images: z.array(z.string().url()),
});

export type PostT = z.infer<typeof postSchema>;
