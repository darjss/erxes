import { initTRPC } from '@trpc/server';
import { ITRPCContext } from 'erxes-api-shared/utils';
import { z } from 'zod';
import { IModels } from '~/connectionResolvers';
import { generateCarFields } from '~/modules/car/fieldUtils';
import { getActiveCarsSelector } from '~/modules/car/utils';

export type CarsTRPCContext = ITRPCContext<{ models: IModels }>;

const t = initTRPC.context<CarsTRPCContext>().create();

export const appRouter = t.router({
  car: t.router({
    find: t.procedure
      .input(z.object({ query: z.any() }))
      .query(async ({ ctx, input }) => {
        const { models } = ctx;

        return await models.Cars.find(input.query).lean();
      }),
    tag: t.procedure
      .input(
        z.object({
          action: z.enum(['count', 'tagObject']),
          _ids: z.array(z.string()).optional(),
          targetIds: z.array(z.string()).optional(),
          tagIds: z.array(z.string()).optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const { models } = ctx;
        const { action, _ids = [], targetIds = [], tagIds = [] } = input;

        if (action === 'count') {
          return await models.Cars.countDocuments({
            ...getActiveCarsSelector(),
            tagIds: { $in: _ids },
          });
        }

        await models.Cars.updateMany(
          { _id: { $in: targetIds } },
          { $set: { tagIds } },
        );

        return await models.Cars.find({ _id: { $in: targetIds } }).lean();
      }),
  }),
  fields: t.router({
    getFieldList: t.procedure
      .input(
        z.object({
          moduleType: z.string(),
          collectionType: z.string().optional(),
          segmentId: z.string().optional(),
          usageType: z.string().optional(),
          config: z.record(z.any()).optional(),
        }),
      )
      .query(async ({ ctx, input }) => {
        const { models } = ctx;

        if (input.moduleType !== 'car') {
          return [];
        }

        return await generateCarFields(models);
      }),
  }),
});

export type AppRouter = typeof appRouter;
