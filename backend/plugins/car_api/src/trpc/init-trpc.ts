import { initTRPC } from '@trpc/server';
import { ITRPCContext } from 'erxes-api-shared/utils';
import { z } from 'zod';
import { IModels } from '~/connectionResolvers';
import { generateCarFields } from '~/modules/car/fieldUtils';
import { getActiveCarsSelector } from '~/modules/car/utils';

export type CarsTRPCContext = ITRPCContext<{ models: IModels }>;

const t = initTRPC.context<CarsTRPCContext>().create();

const stringQueryCondition = z.union([
  z.string(),
  z
    .object({
      $in: z.array(z.string()).optional(),
      $nin: z.array(z.string()).optional(),
      $ne: z.string().optional(),
    })
    .strict(),
]);

const carFindQuerySchema = z
  .object({
    _id: stringQueryCondition.optional(),
    ownerId: stringQueryCondition.optional(),
    categoryId: stringQueryCondition.optional(),
    plateNumber: stringQueryCondition.optional(),
    vinNumber: stringQueryCondition.optional(),
    tagIds: stringQueryCondition.optional(),
    status: stringQueryCondition.optional(),
  })
  .strict();

export const appRouter = t.router({
  car: t.router({
    find: t.procedure
      .input(z.object({ query: carFindQuerySchema.optional() }))
      .query(async ({ ctx, input }) => {
        const { models } = ctx;
        const query = input.query || {};

        return await models.Cars.find({
          $and: [query, getActiveCarsSelector()],
        }).lean();
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

        if (!ctx.userId) {
          throw new Error('Authenticated user context is required to tag cars');
        }

        if (!targetIds.length) {
          throw new Error('targetIds are required to tag cars');
        }

        await models.Cars.updateMany(
          { ...getActiveCarsSelector(), _id: { $in: targetIds } },
          { $set: { tagIds } },
        );

        return await models.Cars.find({
          ...getActiveCarsSelector(),
          _id: { $in: targetIds },
        }).lean();
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
