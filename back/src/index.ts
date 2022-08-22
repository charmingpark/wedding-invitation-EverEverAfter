import * as trpc from '@trpc/server';
import { postRouter } from './posts/router';
import { userRouter } from './users/user';

export const appRouter = trpc
  .router()
  .merge('user.', userRouter)
  .merge('post.', postRouter);

export type AppRouter = typeof appRouter;
