import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { ITRPCContext } from 'erxes-api-shared/utils';
import { IModels } from '~/connectionResolvers';

type BlockAgencyTRPCContext = ITRPCContext<{ models: IModels }>;

const t = initTRPC.context<BlockAgencyTRPCContext>().create();

export const appRouter = t.router({
  agency: {
    getAgencies: t.procedure.query(async ({ ctx }) => {
      return ctx.models.BlockAgency.find({}).lean();
    }),
    getAgencyById: t.procedure
      .input(z.object({ agencyId: z.string() }))
      .query(async ({ ctx, input }) => {
        return (
          ctx.models.BlockAgency.findOne({ _id: input.agencyId }).lean() ?? null
        );
      }),
  },
  unit: {
    assign: t.procedure
      .input(
        z.object({
          blockUnitId: z.string(),
          agencyId: z.string(),
          blockSubdomain: z.string(),
          agencySubdomain: z.string(),
          blockDeveloperName: z.string().optional(),
          unitNumber: z.string().optional(),
          projectId: z.string().optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        return ctx.models.BlockUnitAssignment.findOneAndUpdate(
          { blockUnitId: input.blockUnitId, agencyId: input.agencyId },
          { $set: input },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        ).lean();
      }),
  },
});

export type AppRouter = typeof appRouter;
