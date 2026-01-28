import * as fs from 'fs';
import * as path from 'path';
import mongoose from 'mongoose';
import { connect, closeMongooose } from 'erxes-api-shared/utils';
import { loadClasses, IModels } from '../src/connectionResolvers';

interface MessageEntry {
  providerId: string;
  organizationId: string;
}

async function updateProviderInstanceIds(
  messageJsonPath: string,
): Promise<void> {
  if (!fs.existsSync(messageJsonPath)) {
    throw new Error(`JSON file not found: ${messageJsonPath}`);
  }

  const fileContent = fs.readFileSync(messageJsonPath, 'utf-8');
  let entries: MessageEntry[];

  try {
    const data: MessageEntry[] | MessageEntry = JSON.parse(fileContent);
    entries = Array.isArray(data) ? data : [data];
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON in ${messageJsonPath}: ${msg}`);
  }

  const validEntries = entries.filter(
    (e) =>
      typeof e?.providerId === 'string' &&
      typeof e?.organizationId === 'string' &&
      e.providerId.trim() !== '' &&
      e.organizationId.trim() !== '',
  );

  if (validEntries.length === 0) {
    process.stdout.write(
      'No valid providerId/organizationId entries found in file.\n',
    );
    return;
  }

  await connect();

  const db: mongoose.Connection = mongoose.connection;
  const models: IModels = loadClasses(db);

  let updatedCount = 0;
  let notFoundCount = 0;
  const errors: string[] = [];

  for (const entry of validEntries) {
    try {
      const result = await models.Provider.updateOne(
        { _id: entry.providerId },
        { $set: { instanceId: entry.organizationId, modifiedAt: new Date() } },
      );

      if (result.matchedCount === 0) {
        notFoundCount += 1;
        errors.push(`Provider not found: ${entry.providerId}`);
      } else {
        updatedCount += 1;
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      errors.push(`${entry.providerId}: ${msg}`);
    }
  }

  await closeMongooose();

  process.stdout.write(
    `InstanceId update completed. Updated: ${updatedCount}, Not found: ${notFoundCount}, Total processed: ${validEntries.length}\n`,
  );

  if (errors.length > 0) {
    process.stderr.write(`Errors (${errors.length}):\n`);
    errors.slice(0, 20).forEach((e) => process.stderr.write(`  ${e}\n`));
    if (errors.length > 20) {
      process.stderr.write(`  ... and ${errors.length - 20} more\n`);
    }
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const messageJsonPath =
    args.length > 0
      ? path.resolve(args[0])
      : path.resolve(__dirname, 'message.json');

  try {
    await updateProviderInstanceIds(messageJsonPath);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Update failed: ${msg}\n`);
    if (error instanceof Error && error.stack) {
      process.stderr.write(`${error.stack}\n`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
