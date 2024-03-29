import { FakeCommentRepo } from '../comments/repository';
import { FakePostRepo } from './repository';
import { postRouter } from './router';

const NEW_POST = {
  message: 'test',
  images: [
    'https://pbs.twimg.com/profile_banners/1261543922309849088/1615648508/1500x500',
  ],
};

describe('posts', () => {
  it('scenario', async () => {
    const ctx = {
      commentRepo: FakeCommentRepo([]),
      postRepo: FakePostRepo([]),
    };
    // caller를 만들고
    const caller = postRouter.createCaller(ctx);

    // 처음에는 비어 있는데
    expect(await caller.query('all')).toStrictEqual([]);
    // 새 post를 추가하면
    await caller.mutation('create', NEW_POST);

    // post가 들어 있는 배열이 온다.
    expect(await caller.query('all')).toStrictEqual([
      {
        id: 1,
        ...NEW_POST,
      },
    ]);

    await caller.mutation('modify', {
      targetId: 1,
      newMessage: 'modified',
    });

    expect(await caller.query('all')).toStrictEqual([
      {
        id: 1,
        message: 'modified',
        images: NEW_POST.images,
      },
    ]);

    await caller.mutation('delete', { targetId: 1 });

    // 다시 비어 있게 된다
    expect(await caller.query('all')).toStrictEqual([]);
  });
});
