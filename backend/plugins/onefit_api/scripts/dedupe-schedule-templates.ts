/**
 * One-time maintenance: removes duplicate onefit_schedule_templates documents
 * that share the same (providerId, year, month). Keeps the document with the
 * latest createdAt (ties: lexicographically greatest _id).
 *
 * Run BEFORE creating the unique compound index on (providerId, year, month).
 * Usage (from repo root, with MONGO_URL set):
 *   pnpm exec tsx backend/plugins/onefit_api/scripts/dedupe-schedule-templates.ts
 */
import mongoose from 'mongoose';
import { connect, closeMongooose } from 'erxes-api-shared/utils';
import { loadClasses, IModels } from '../src/connectionResolvers';

interface DupGroup {
  _id: { providerId: string; year: number; month: number };
  ids: string[];
}

async function dedupeScheduleTemplates(): Promise<void> {
  await connect();

  const db: mongoose.Connection = mongoose.connection;
  const models: IModels = loadClasses(db);

  const dupGroups = await models.ScheduleTemplate.aggregate<DupGroup>([
    {
      $group: {
        _id: {
          providerId: '$providerId',
          year: '$year',
          month: '$month',
        },
        ids: { $push: '$_id' },
        count: { $sum: 1 },
      },
    },
    { $match: { count: { $gt: 1 } } },
    { $project: { _id: 1, ids: 1 } },
  ]);

  let deletedTotal = 0;
  console.log('dupGroups', dupGroups);
  for (const group of dupGroups) {
    const docs = await models.ScheduleTemplate.find({
      _id: { $in: group.ids },
    })
      .select({ _id: 1, createdAt: 1 })
      .lean()
      .exec();

    const sorted = [...docs].sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (tb !== ta) return tb - ta;
      return String(b._id).localeCompare(String(a._id));
    });

    const keepId = sorted[0]?._id;
    const removeIds = sorted.slice(1).map((d) => d._id);

    if (!keepId || removeIds.length === 0) continue;

    const result = await models.ScheduleTemplate.deleteMany({
      _id: { $in: removeIds },
    });
    deletedTotal += result.deletedCount ?? 0;
  }

  await closeMongooose();

  process.stdout.write(
    `dedupe-schedule-templates: processed ${dupGroups.length} duplicate group(s), deleted ${deletedTotal} document(s).\n`,
  );
}

dedupeScheduleTemplates().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  process.stderr.write(`dedupe-schedule-templates failed: ${msg}\n`);
  process.exit(1);
});
