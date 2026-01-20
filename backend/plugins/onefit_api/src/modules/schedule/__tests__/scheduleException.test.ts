// import {
//   setupTestDatabase,
//   cleanupTestDatabase,
//   closeTestDatabase,
//   getTestContext,
//   createTestProvider,
//   createTestActivityType,
//   createTestScheduleException,
// } from './setup';
// import { scheduleMutations } from '@/schedule/graphql/resolvers/mutations/schedule';
// import { scheduleQueries } from '@/schedule/graphql/resolvers/queries/schedule';

// describe('Schedule Exception Integration Tests', () => {
//   beforeAll(async () => {
//     await setupTestDatabase();
//   });

//   afterEach(async () => {
//     await cleanupTestDatabase();
//   });

//   afterAll(async () => {
//     await closeTestDatabase();
//   });

//   describe('oneFitScheduleExceptionCreate', () => {
//     it('should create a schedule exception', async () => {
//       const context = getTestContext();
//       const providerId = await createTestProvider();
//       const exceptionDate = new Date(2024, 0, 15);

//       const exception = await scheduleMutations.oneFitScheduleExceptionCreate(
//         undefined,
//         {
//           providerId,
//           date: exceptionDate,
//           reason: 'Holiday',
//         },
//         context,
//       );

//       expect(exception).toBeDefined();
//       expect(exception.providerId).toBe(providerId);
//       expect(exception.reason).toBe('Holiday');
//       expect(new Date(exception.date).getTime()).toBe(exceptionDate.getTime());
//     });

//     it('should create an exception with activityTypeId', async () => {
//       const context = getTestContext();
//       const providerId = await createTestProvider();
//       const activityTypeId = await createTestActivityType({ providerId });
//       const exceptionDate = new Date(2024, 0, 15);

//       const exception = await scheduleMutations.oneFitScheduleExceptionCreate(
//         undefined,
//         {
//           providerId,
//           date: exceptionDate,
//           reason: 'Maintenance',
//           activityTypeId,
//         },
//         context,
//       );

//       expect(exception.activityTypeId).toBe(activityTypeId);
//     });
//   });

//   describe('oneFitScheduleExceptionRemove', () => {
//     it('should remove a schedule exception', async () => {
//       const context = getTestContext();
//       const providerId = await createTestProvider();
//       const exceptionDate = new Date(2024, 0, 15);
//       const exceptionId = await createTestScheduleException({
//         providerId,
//         date: exceptionDate,
//         reason: 'Holiday',
//       });

//       const result = await scheduleMutations.oneFitScheduleExceptionRemove(
//         undefined,
//         { _id: exceptionId },
//         context,
//       );
//       console.log('ajdjknasdaknjdjknn', result);
//       expect(result.ok).toBe(1);

//       const exception = await context.models.ScheduleException.findOne({
//         _id: exceptionId,
//       });
//       expect(exception).toBeNull();
//     });
//   });

//   describe('oneFitScheduleExceptionsRemove', () => {
//     it('should remove multiple schedule exceptions', async () => {
//       const context = getTestContext();
//       const providerId = await createTestProvider();

//       const exceptionId1 = await createTestScheduleException({
//         providerId,
//         date: new Date(2024, 0, 15),
//         reason: 'Holiday 1',
//       });

//       const exceptionId2 = await createTestScheduleException({
//         providerId,
//         date: new Date(2024, 0, 16),
//         reason: 'Holiday 2',
//       });

//       const result = await scheduleMutations.oneFitScheduleExceptionsRemove(
//         undefined,
//         { ids: [exceptionId1, exceptionId2] },
//         context,
//       );

//       expect(result.n).toBe(2);

//       const exception1 = await context.models.ScheduleException.findOne({
//         _id: exceptionId1,
//       });
//       const exception2 = await context.models.ScheduleException.findOne({
//         _id: exceptionId2,
//       });

//       expect(exception1).toBeNull();
//       expect(exception2).toBeNull();
//     });
//   });

//   describe('oneFitScheduleExceptions', () => {
//     it('should query schedule exceptions with date range', async () => {
//       const context = getTestContext();
//       const providerId = await createTestProvider();

//       await createTestScheduleException({
//         providerId,
//         date: new Date(2024, 0, 15),
//         reason: 'Holiday 1',
//       });

//       await createTestScheduleException({
//         providerId,
//         date: new Date(2024, 0, 20),
//         reason: 'Holiday 2',
//       });

//       await createTestScheduleException({
//         providerId,
//         date: new Date(2024, 1, 5),
//         reason: 'Holiday 3',
//       });

//       const result = await scheduleQueries.oneFitScheduleExceptions(
//         undefined,
//         {
//           providerId,
//           startDate: new Date(2024, 0, 1),
//           endDate: new Date(2024, 0, 31),
//         },
//         context,
//       );

//       expect(result.list.length).toBe(2);
//       expect(result.list.every((ex) => ex.providerId === providerId)).toBe(true);
//     });

//     it('should filter exceptions by activityTypeId', async () => {
//       const context = getTestContext();
//       const providerId = await createTestProvider();
//       const activityTypeId1 = await createTestActivityType({ providerId });
//       const activityTypeId2 = await createTestActivityType({ providerId });

//       await createTestScheduleException({
//         providerId,
//         date: new Date(2024, 0, 15),
//         reason: 'Exception 1',
//         activityTypeId: activityTypeId1,
//       });

//       await createTestScheduleException({
//         providerId,
//         date: new Date(2024, 0, 16),
//         reason: 'Exception 2',
//         activityTypeId: activityTypeId2,
//       });

//       const result = await scheduleQueries.oneFitScheduleExceptions(
//         undefined,
//         {
//           providerId,
//           activityTypeId: activityTypeId1,
//           startDate: new Date(2024, 0, 1),
//           endDate: new Date(2024, 0, 31),
//         },
//         context,
//       );

//       expect(result.list.length).toBe(1);
//       expect(result.list[0].activityTypeId).toBe(activityTypeId1);
//     });
//   });

//   describe('oneFitScheduleException', () => {
//     it('should get schedule exception by ID', async () => {
//       const context = getTestContext();
//       const providerId = await createTestProvider();
//       const exceptionId = await createTestScheduleException({
//         providerId,
//         date: new Date(2024, 0, 15),
//         reason: 'Holiday',
//       });

//       const exception = await scheduleQueries.oneFitScheduleException(
//         undefined,
//         { _id: exceptionId },
//         context,
//       );

//       expect(exception).toBeDefined();
//       expect(exception?._id).toBe(exceptionId);
//       expect(exception?.reason).toBe('Holiday');
//     });

//     it('should return null for non-existent exception', async () => {
//       const context = getTestContext();

//       const exception = await scheduleQueries.oneFitScheduleException(
//         undefined,
//         { _id: 'non_existent_id' },
//         context,
//       );

//       expect(exception).toBeNull();
//     });
//   });
// });
