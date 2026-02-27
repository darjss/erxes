import mongoose from 'mongoose';
import { connect, closeMongooose } from 'erxes-api-shared/utils';
import { loadClasses, IModels } from '../src/connectionResolvers';

interface ExternalDate {
  $date: string;
}

interface ExternalUser {
  _id: string;
  username?: string;
  email?: string;
  name?: string;
  phone?: string;
  status?: number;
  birthDate?: ExternalDate;
  gender?: string;
  crm_id?: number;
  fbPhotoUrl?: string;
  _created_at?: ExternalDate;
  _updated_at?: ExternalDate;
}

function toDate(value?: ExternalDate): Date | undefined {
  if (!value || !value.$date) {
    return undefined;
  }

  const date = new Date(value.$date);

  return Number.isNaN(date.getTime()) ? undefined : date;
}

function splitName(fullName?: string): {
  firstName?: string;
  lastName?: string;
} {
  if (!fullName || !fullName.trim()) {
    return {};
  }

  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 1) {
    return { firstName: parts[0] };
  }

  const [firstName, ...rest] = parts;

  return {
    firstName,
    lastName: rest.join(' '),
  };
}

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

function isValidEmail(value: string): boolean {
  if (!value || value.length > 254) {
    return false;
  }
  return EMAIL_REGEX.test(value);
}

const PHONE_MIN_DIGITS = 7;
const PHONE_MAX_DIGITS = 15;

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= PHONE_MIN_DIGITS && digits.length <= PHONE_MAX_DIGITS;
}

const BATCH_SIZE = 5000;

async function importOnefit2Users(externalUri: string): Promise<void> {
  process.stdout.write('Starting import of Onefit2 users...\n');

  if (!externalUri) {
    throw new Error(
      'External MongoDB URI for onefit2 is required (ONEFIT2_MONGO_URL)',
    );
  }

  process.stdout.write(
    `Connecting to external MongoDB (onefit2): ${externalUri}\n`,
  );

  const externalConnection = await mongoose
    .createConnection(externalUri)
    .asPromise();

  try {
    const externalDb = externalConnection.db;

    if (!externalDb) {
      throw new Error('Failed to acquire external MongoDB database instance');
    }

    const userCollection = externalDb.collection('_User');

    const externalUsers = (await userCollection
      .find({})
      .toArray()) as unknown as ExternalUser[];

    process.stdout.write(`Loaded ${externalUsers.length} users from onefit2\n`);

    await connect();
    process.stdout.write('Connected to local MongoDB\n');

    const db: mongoose.Connection = mongoose.connection;
    const models: IModels = loadClasses(db);

    process.stdout.write('Loading existing OneFit customers for lookup...\n');
    const existing = await models.OneFitCustomer.find(
      {},
      {
        _id: 1,
        onefit2UserId: 1,
        primaryPhone: 1,
        primaryEmail: 1,
        createdAt: 1,
      },
    )
      .lean()
      .exec();

    const byOnefit2Id = new Map<string, { _id: string; createdAt?: Date }>();
    const byPhone = new Map<string, { _id: string; createdAt?: Date }>();
    const byEmail = new Map<string, { _id: string; createdAt?: Date }>();

    for (const c of existing) {
      const row = c as Record<string, unknown>;
      const id = String(c._id);
      const rec = { _id: id, createdAt: c.createdAt };
      if (row.onefit2UserId) {
        byOnefit2Id.set(String(row.onefit2UserId), rec);
      }
      if (row.primaryPhone) {
        byPhone.set(String(row.primaryPhone).trim(), rec);
      }
      if (row.primaryEmail) {
        byEmail.set(String(row.primaryEmail).trim().toLowerCase(), rec);
      }
    }

    process.stdout.write(
      `Existing customers in DB: ${existing.length} (indexed for lookup)\n`,
    );

    const toInsert: any[] = [];
    const toUpdate: Array<{
      filter: { _id: string };
      update: { $set: any };
    }> = [];
    const pendingPhone = new Set<string>();
    const pendingEmail = new Set<string>();

    let skippedNoContact = 0;
    let skippedInvalidPhone = 0;
    let skippedInvalidEmail = 0;

    for (const externalUser of externalUsers) {
      const userId = externalUser._id;
      const rawPhone = (externalUser.phone || '').trim();
      const rawEmail = (externalUser.email || externalUser.username || '')
        .trim()
        .toLowerCase();

      let phone: string | undefined;
      if (rawPhone) {
        phone = isValidPhone(rawPhone) ? rawPhone : undefined;
        if (!phone) skippedInvalidPhone += 1;
      }
      let email: string | undefined;
      if (rawEmail) {
        email = isValidEmail(rawEmail) ? rawEmail : undefined;
        if (!email) skippedInvalidEmail += 1;
      }

      if (!phone && !email) {
        skippedNoContact += 1;
        continue;
      }

      const nameParts = splitName(externalUser.name);
      const createdAt = toDate(externalUser._created_at) || new Date();
      const updatedAt = toDate(externalUser._updated_at) || new Date();

      const customerPayload: any = {
        _id: userId,

        onefit2UserId: userId,
        username: externalUser.username,
        firstName: nameParts.firstName,
        lastName: nameParts.lastName,
        gender: externalUser.gender,
        birthDate: toDate(externalUser.birthDate),
        crmId: externalUser.crm_id,
        avatar: externalUser.fbPhotoUrl,
        status: externalUser.status === 1 ? 'active' : 'archived',
        state: 'customer',
        primaryEmail: email,
        emails: email ? [email] : [],
        primaryPhone: phone,
        phones: phone ? [phone] : [],
        createdAt,
        updatedAt,
      };

      const existingByOnefit = userId ? byOnefit2Id.get(userId) : undefined;
      const existingByPhone = phone ? byPhone.get(phone) : undefined;
      const existingByEmail = email ? byEmail.get(email) : undefined;

      const existingRec =
        existingByOnefit || existingByPhone || existingByEmail;

      if (existingRec) {
        const { _id: _omit, ...payloadWithoutId } = customerPayload;
        toUpdate.push({
          filter: { _id: existingRec._id },
          update: {
            $set: {
              ...payloadWithoutId,
              createdAt: existingRec.createdAt || customerPayload.createdAt,
            },
          },
        });
      } else if (
        (phone && pendingPhone.has(phone)) ||
        (email && pendingEmail.has(email))
      ) {
        skippedNoContact += 1;
      } else {
        toInsert.push(customerPayload);
        if (phone) pendingPhone.add(phone);
        if (email) pendingEmail.add(email);
      }
    }

    let createdCustomers = 0;
    let updatedCustomers = 0;

    const collection = models.OneFitCustomer.collection;

    if (toInsert.length > 0) {
      process.stdout.write(
        `Bulk inserting ${toInsert.length} new customers (batch size ${BATCH_SIZE})...\n`,
      );
      for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
        const batch = toInsert.slice(i, i + BATCH_SIZE);
        try {
          await collection.insertMany(batch, { ordered: false });
          createdCustomers += batch.length;
          process.stdout.write(
            `  Inserted ${Math.min(i + BATCH_SIZE, toInsert.length)} / ${
              toInsert.length
            }\n`,
          );
        } catch (err: any) {
          if (err.writeErrors) {
            const inserted = err.insertedIds
              ? Object.keys(err.insertedIds).length
              : 0;
            createdCustomers += inserted;
            process.stderr.write(
              `  Batch partial success: ${inserted} inserted, ${err.writeErrors.length} errors (e.g. duplicates)\n`,
            );
          } else {
            throw err;
          }
        }
      }
    }

    if (toUpdate.length > 0) {
      process.stdout.write(
        `Bulk updating ${toUpdate.length} existing customers (batch size ${BATCH_SIZE})...\n`,
      );
      for (let i = 0; i < toUpdate.length; i += BATCH_SIZE) {
        const batch = toUpdate.slice(i, i + BATCH_SIZE);
        const ops = batch.map(({ filter, update }) => ({
          updateOne: { filter, update },
        }));
        const result = await collection.bulkWrite(
          ops as unknown as Parameters<typeof collection.bulkWrite>[0],
          { ordered: false },
        );
        updatedCustomers += result.modifiedCount || 0;
        process.stdout.write(
          `  Updated ${Math.min(i + BATCH_SIZE, toUpdate.length)} / ${
            toUpdate.length
          }\n`,
        );
      }
    }

    process.stdout.write('\n=== Onefit2 User Import Summary ===\n');
    process.stdout.write(
      `Total external users processed: ${externalUsers.length}\n`,
    );
    process.stdout.write(`Invalid phone (discarded): ${skippedInvalidPhone}\n`);
    process.stdout.write(`Invalid email (discarded): ${skippedInvalidEmail}\n`);
    process.stdout.write(
      `Skipped (no valid phone/email or duplicate): ${skippedNoContact}\n`,
    );
    process.stdout.write(`Customers created: ${createdCustomers}\n`);
    process.stdout.write(`Customers updated: ${updatedCustomers}\n`);
    process.stdout.write('Import completed.\n');
  } finally {
    await externalConnection.close();
    await closeMongooose();
  }
}

async function main() {
  const externalUri = process.env.ONEFIT2_MONGO_URL;

  if (!externalUri) {
    throw new Error('ONEFIT2_MONGO_URL environment variable is required');
  }

  try {
    await importOnefit2Users(externalUri);
  } catch (error: any) {
    process.stderr.write(
      `Onefit2 user import failed: ${error.message || error}\n`,
    );
    if (error.stack) {
      process.stderr.write(`${error.stack}\n`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

// ONEFIT2_MONGO_URL=mongodb://localhost:27017/onefit2 pnpm tsx scripts/import-onefit2-users.ts
