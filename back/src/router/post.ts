import * as trpc from '@trpc/server';
import { z } from 'zod';

const postSchema = z.object({
  message: z.string().min(1),
  images: z.array(z.string().url()),
});

type PostT = z.infer<typeof postSchema>;

export interface PostRepository {
  all: () => Promise<PostT[]>,
  add: (newPost: PostT) => Promise<void>,
}

let fakeDB: PostT[] = [{
  message: 'test',
  images: ["https://pbs.twimg.com/profile_banners/1261543922309849088/1615648508/1500x500"]
}, {
  message: 'test2',
  images: ["https://pbs.twimg.com/profile_banners/1261543922309849088/1615648508/1500x500"]
}];

export const fakeRepo: PostRepository = {
  async all(){
    return fakeDB;
  },
  async add(newPost){
    fakeDB = [...fakeDB, newPost];
  }
}

export const postRouter = trpc
  .router()
  .query('all', {
    output: z.array(postSchema),
    async resolve() {
      return fakeRepo.all();
    },
  })
  .mutation('create', {
    input: postSchema,
    async resolve({ input }) {
      fakeRepo.add(input);
    },
  });
