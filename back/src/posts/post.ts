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
  modify: (input: { targetMessage: string, newMessage: string }) => Promise<void>
}

let fakeDB: PostT[] = [];

export const fakeRepo: PostRepository = {
  async all(){
    return fakeDB;
  },
  async add(newPost){
    fakeDB = [...fakeDB, newPost];
  },
  async modify({targetMessage, newMessage}){
    const newDB = [...fakeDB];
    
    const targetIndex = fakeDB.findIndex((post) => post.message === targetMessage);

    if(targetIndex === -1){
      throw new Error(`404 not found for ${targetMessage}`);
    }

    const old = newDB[targetIndex]!;
    newDB[targetIndex] = {
      message: newMessage,
      images: old.images
    }
    fakeDB = newDB;
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
  })
  // 만약 modify에 두가지 인자를 넣어야한다면..?
  .mutation('modify', {
    input: z.object({
      targetMessage: z.string(),
      newMessage: z.string(),
    }),
    async resolve({input}){
      fakeRepo.modify(input)
    }
  });
