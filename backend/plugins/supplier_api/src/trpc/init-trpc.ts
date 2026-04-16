import { initTRPC } from '@trpc/server';
import { ITRPCContext } from 'erxes-api-shared/utils';
import * as z from 'zod';
import { IModels } from '~/connectionResolvers';

export type SupplierTRPCContext = ITRPCContext<{ models: IModels }>;

const t = initTRPC.context<SupplierTRPCContext>().create();

export const appRouter = t.router({
  health: t.procedure.query(() => ({ status: 'ok' })),
});

export type AppRouter = typeof appRouter;
