import mongoose from 'mongoose';
import { IContext, IModels, loadClasses } from '~/connectionResolvers';
import { DayOfWeek } from '@/schedule/@types/schedule';
import { BookingStatus } from '@/booking/@types/booking';
import { GenderRestriction } from '@/activity-type/@types/activityType';
import { ProviderStatus } from '@/provider/@types/provider';

let connection: mongoose.Connection;
let models: IModels;
let testContext: IContext;

/**
 * Extracts the database name from a MongoDB connection string
 */
function extractDatabaseName(mongoUrl: string): string {
  try {
    // Handle mongodb:// and mongodb+srv:// URLs
    const url = new URL(mongoUrl);
    // Remove leading slash from pathname
    const dbName = url.pathname.replace(/^\//, '').split('?')[0];
    return dbName;
  } catch (error) {
    // Fallback: try to extract from string pattern
    const match = mongoUrl.match(/\/([^/?]+)(\?|$)/);
    return match ? match[1] : '';
  }
}

/**
 * Validates that a database name is safe for testing (contains "test")
 */
function isTestDatabase(dbName: string): boolean {
  if (!dbName) return false;
  const lowerDbName = dbName.toLowerCase();
  return lowerDbName.includes('test') || lowerDbName.includes('_test');
}

export async function setupTestDatabase(): Promise<void> {
  const MONGO_URL = process.env.TEST_MONGO_URL;

  if (!MONGO_URL) {
    throw new Error(
      'TEST_MONGO_URL environment variable must be set to prevent accidental data loss.\n' +
      'Example: TEST_MONGO_URL=mongodb://127.0.0.1:27017/erxes_onefit_test?directConnection=true\n' +
      'The database name must contain "test" for safety.'
    );
  }

  // Extract and validate database name
  const dbName = extractDatabaseName(MONGO_URL);
  
  if (!isTestDatabase(dbName)) {
    throw new Error(
      `SAFETY CHECK FAILED: Database name "${dbName}" does not contain "test".\n` +
      'This is a safety mechanism to prevent accidental data loss.\n' +
      'Only databases with "test" in the name can be used for testing.\n' +
      `Current TEST_MONGO_URL: ${MONGO_URL}\n` +
      'Please use a database name like: erxes_onefit_test, erxes_test, test_db, etc.'
    );
  }

  console.log(`[TEST SETUP] Connecting to test database: ${dbName}`);
  console.log(`[TEST SETUP] MongoDB URL: ${MONGO_URL.replace(/\/\/[^@]+@/, '//***:***@')}`); // Hide credentials if present

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URL, {
      family: 4,
    });
  }

  connection = mongoose.connection;
  models = loadClasses(connection);
  testContext = {
    models,
    subdomain: 'test',
  } as IContext;
}

export async function cleanupTestDatabase(): Promise<void> {
  if (!connection || !connection.db) {
    return;
  }

  const dbName = connection.db.databaseName;

  // Safety check: refuse to clean non-test databases
  if (!isTestDatabase(dbName)) {
    throw new Error(
      `SAFETY CHECK FAILED: Attempted to clean non-test database "${dbName}".\n` +
      'This is a safety mechanism to prevent accidental data loss.\n' +
      'Only databases with "test" in the name can be cleaned.\n' +
      'If you see this error, the test setup may have connected to the wrong database.'
    );
  }

  const collections = await connection.db.collections();
  let deletedCount = 0;
  
  for (const collection of collections) {
    if (collection.collectionName.startsWith('onefit_')) {
      const result = await collection.deleteMany({});
      deletedCount += result.deletedCount || 0;
    }
  }

  if (deletedCount > 0) {
    console.log(`[TEST CLEANUP] Cleaned ${deletedCount} documents from test database: ${dbName}`);
  }
}

export async function closeTestDatabase(): Promise<void> {
  if (connection) {
    // Safety check before closing
    if (connection.db) {
      const dbName = connection.db.databaseName;
      
      if (isTestDatabase(dbName)) {
        // Optionally drop the entire test database for a clean slate
        // This ensures no leftover data between test runs
        try {
          await connection.db.dropDatabase();
          console.log(`[TEST CLEANUP] Dropped test database: ${dbName}`);
        } catch (error) {
          console.warn(`[TEST CLEANUP] Failed to drop test database ${dbName}:`, error);
        }
      } else {
        console.warn(
          `[TEST CLEANUP] Skipping database drop for non-test database: ${dbName}`
        );
      }
    }

    // Remove event listeners that would cause process.exit in tests
    // These listeners are attached by erxes-api-shared/src/utils/mongo/mongo-connection.ts
    mongoose.connection.removeAllListeners('disconnected');
    mongoose.connection.removeAllListeners('error');
    await connection.close();
  }
}

export function getTestContext(): IContext {
  if (!testContext) {
    throw new Error('Test database not initialized. Call setupTestDatabase() first.');
  }
  return testContext;
}

export function getTestModels(): IModels {
  if (!models) {
    throw new Error('Test models not initialized. Call setupTestDatabase() first.');
  }
  return models;
}

export interface TestProviderData {
  _id?: string;
  businessName?: { en: string; mn: string };
  location?: {
    address: { en: string; mn: string };
    city: { en: string; mn: string };
    coordinates?: { lat: number; lng: number };
  };
  contactInfo?: { phone: string; email: string };
  categoryIds?: string[];
  status?: ProviderStatus;
  instanceId?: string;
}

export async function createTestProvider(
  data: TestProviderData = {},
): Promise<string> {
  const models = getTestModels();
  const provider = await models.Provider.create({
    businessName: data.businessName || { en: 'Test Provider', mn: 'Туршилтын үйлчилгээ' },
    location: data.location || {
      address: { en: '123 Test St', mn: 'Туршилтын хаяг' },
      city: { en: 'Test City', mn: 'Туршилтын хот' },
      coordinates: { lat: 47.8864, lng: 106.9057 }, // Default Ulaanbaatar coordinates
    },
    contactInfo: data.contactInfo || {
      phone: '+97612345678',
      email: 'test@example.com',
    },
    categoryIds: data.categoryIds || [],
    status: data.status || ProviderStatus.APPROVED,
    instanceId: data.instanceId,
  });
  return provider._id;
}

export interface TestActivityTypeData {
  _id?: string;
  providerId: string;
  name?: { en: string; mn: string };
  creditCost?: number;
  duration?: number;
  genderRestriction?: GenderRestriction;
  categoryIds?: string[];
  isActive?: boolean;
}

export async function createTestActivityType(
  data: TestActivityTypeData,
): Promise<string> {
  const models = getTestModels();
  const activityType = await models.ActivityType.create({
    providerId: data.providerId,
    name: data.name || { en: 'Test Activity', mn: 'Туршилтын үйл ажиллагаа' },
    creditCost: data.creditCost ?? 10,
    duration: data.duration ?? 60,
    genderRestriction: data.genderRestriction || GenderRestriction.MIXED,
    categoryIds: data.categoryIds || [],
    isActive: data.isActive !== undefined ? data.isActive : true,
  });
  return activityType._id;
}

export interface TestScheduleTemplateData {
  providerId: string;
  month: number;
  year: number;
  dailySchedules?: Array<{
    dayOfWeek: DayOfWeek;
    activityTypeId: string;
    genderRestriction: string;
    startTime: string;
    endTime: string;
    dailyLimit: number;
  }>;
}

export async function createTestScheduleTemplate(
  data: TestScheduleTemplateData,
): Promise<string> {
  const models = getTestModels();
  const template = await models.ScheduleTemplate.createTemplate({
    providerId: data.providerId,
    month: data.month,
    year: data.year,
    dailySchedules: data.dailySchedules || [],
  });
  return template._id;
}

export interface TestScheduleExceptionData {
  providerId: string;
  date: Date;
  reason?: string;
  activityTypeId?: string;
}

export async function createTestScheduleException(
  data: TestScheduleExceptionData,
): Promise<string> {
  const models = getTestModels();
  // Store date as-is, normalization happens during query
  const exception = await models.ScheduleException.createException({
    providerId: data.providerId,
    date: data.date,
    reason: data.reason,
    activityTypeId: data.activityTypeId,
  });
  return exception._id;
}

export interface TestBookingData {
  userId: string;
  providerId: string;
  activityTypeId: string;
  bookingDate: Date;
  startTime: string;
  endTime: string;
  creditCost?: number;
  status?: BookingStatus;
}

export async function createTestBooking(
  data: TestBookingData,
): Promise<string> {
  const models = getTestModels();
  // Store date as-is, normalization happens during query
  const booking = await models.Booking.create({
    userId: data.userId,
    providerId: data.providerId,
    activityTypeId: data.activityTypeId,
    bookingDate: data.bookingDate,
    startTime: data.startTime,
    endTime: data.endTime,
    creditCost: data.creditCost ?? 10,
    status: data.status || BookingStatus.CONFIRMED,
  });
  return booking._id;
}

export function createTestUserId(): string {
  return `test_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
