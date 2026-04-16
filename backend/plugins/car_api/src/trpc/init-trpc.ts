import { initTRPC } from '@trpc/server';

import { ITRPCContext } from 'erxes-api-shared/utils';

const t = initTRPC.context<ITRPCContext>().create();

export const appRouter = t.router({
  car: {
    hello: t.procedure.query(() => {
      return 'Hello car';
    }),
  },
});

export type AppRouter = typeof appRouter;
