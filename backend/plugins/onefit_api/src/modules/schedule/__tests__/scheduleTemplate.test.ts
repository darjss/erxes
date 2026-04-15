// import {
//   setupTestDatabase,
//   cleanupTestDatabase,
//   closeTestDatabase,
//   getTestContext,
//   createTestProvider,
//   createTestActivityType,
//   createTestScheduleTemplate,
// } from './setup';
// import { scheduleMutations } from '@/schedule/graphql/resolvers/mutations/schedule';
// import { scheduleQueries } from '@/schedule/graphql/resolvers/queries/schedule';
// import { DayOfWeek } from '@/schedule/@types/schedule';

// describe('Schedule Template Integration Tests', () => {
//   beforeAll(async () => {
//     await setupTestDatabase();
//   });

//   afterEach(async () => {
//     await cleanupTestDatabase();
//   });

//   afterAll(async () => {
//     await closeTestDatabase();
//   });

//   describe('oneFitScheduleTemplateCreate', () => {
//     it('should create a schedule template', async () => {
//       const context = getTestContext();
//       const providerId = await createTestProvider();
//       const activityTypeId = await createTestActivityType({ providerId });

//       const template = await scheduleMutations.oneFitScheduleTemplateCreate(
//         undefined,
//         {
//           providerId,
//           month: 1,
//           year: 2024,
//           dailySchedules: [
//             {
//               dayOfWeek: DayOfWeek.MONDAY,
//               activityTypeId,
//               genderRestriction: 'mixed',
//               startTime: '09:00',
//               endTime: '10:00',
//               dailyLimit: 10,
//             },
//           ],
//         },
//         context,
//       );

//       expect(template).toBeDefined();
//       expect(template.providerId).toBe(providerId);
//       expect(template.month).toBe(1);
//       expect(template.year).toBe(2024);
//       expect(template.dailySchedules).toHaveLength(1);
//       expect(template.dailySchedules[0].dayOfWeek).toBe(DayOfWeek.MONDAY);
//       expect(template.dailySchedules[0].dailyLimit).toBe(10);
//     });

//     it('should create a template with multiple daily schedules', async () => {
//       const context = getTestContext();
//       const providerId = await createTestProvider();
//       const activityTypeId = await createTestActivityType({ providerId });

//       const template = await scheduleMutations.oneFitScheduleTemplateCreate(
//         undefined,
//         {
//           providerId,
//           month: 1,
//           year: 2024,
//           dailySchedules: [
//             {
//               dayOfWeek: DayOfWeek.MONDAY,
//               activityTypeId,
//               genderRestriction: 'mixed',
//               startTime: '09:00',
//               endTime: '10:00',
//               dailyLimit: 10,
//             },
//             {
//               dayOfWeek: DayOfWeek.WEDNESDAY,
//               activityTypeId,
//               genderRestriction: 'mixed',
//               startTime: '14:00',
//               endTime: '15:00',
//               dailyLimit: 15,
//             },
//           ],
//         },
//         context,
//       );

//       expect(template.dailySchedules).toHaveLength(2);
//     });
//   });

//   describe('oneFitScheduleTemplateUpdate', () => {
//     it('should update a schedule template', async () => {
//       const context = getTestContext();
//       const providerId = await createTestProvider();
//       const activityTypeId = await createTestActivityType({ providerId });
//       const templateId = await createTestScheduleTemplate({
//         providerId,
//         month: 1,
//         year: 2024,
//         dailySchedules: [
//           {
//             dayOfWeek: DayOfWeek.MONDAY,
//             activityTypeId,
//             genderRestriction: 'mixed',
//             startTime: '09:00',
//             endTime: '10:00',
//             dailyLimit: 10,
//           },
//         ],
//       });

//       const updated = await scheduleMutations.oneFitScheduleTemplateUpdate(
//         undefined,
//         {
//           _id: templateId,
//           dailySchedules: [
//             {
//               dayOfWeek: DayOfWeek.MONDAY,
//               activityTypeId,
//               genderRestriction: 'mixed',
//               startTime: '09:00',
//               endTime: '10:00',
//               dailyLimit: 20,
//             },
//           ],
//         },
//         context,
//       );

//       expect(updated.dailySchedules[0].dailyLimit).toBe(20);
//     });
//   });

//   describe('oneFitScheduleTemplateCopyPreviousMonth', () => {
//     it('should copy schedule template from previous month', async () => {
//       const context = getTestContext();
//       const providerId = await createTestProvider();
//       const activityTypeId = await createTestActivityType({ providerId });

//       await createTestScheduleTemplate({
//         providerId,
//         month: 1,
//         year: 2024,
//         dailySchedules: [
//           {
//             dayOfWeek: DayOfWeek.MONDAY,
//             activityTypeId,
//             genderRestriction: 'mixed',
//             startTime: '09:00',
//             endTime: '10:00',
//             dailyLimit: 10,
//           },
//         ],
//       });

//       const copied = await scheduleMutations.oneFitScheduleTemplateCopyPreviousMonth(
//         undefined,
//         {
//           providerIds: [providerId],
//           fromYear: 2024,
//           fromMonth: 1,
//           toYear: 2024,
//           toMonth: 2,
//         },
//         context,
//       );

//       expect(copied.templates).toHaveLength(1);
//       expect(copied.skippedProviderIds).toHaveLength(0);
//       expect(copied.templates[0].month).toBe(2);
//       expect(copied.templates[0].year).toBe(2024);
//       expect(copied.templates[0].dailySchedules).toHaveLength(1);
//       expect(copied.templates[0].dailySchedules[0].dailyLimit).toBe(10);
//     });
//   });

//   describe('oneFitScheduleTemplatesRemove', () => {
//     it('should remove schedule templates', async () => {
//       const context = getTestContext();
//       const providerId = await createTestProvider();
//       const activityTypeId = await createTestActivityType({ providerId });

//       const templateId1 = await createTestScheduleTemplate({
//         providerId,
//         month: 1,
//         year: 2024,
//         dailySchedules: [
//           {
//             dayOfWeek: DayOfWeek.MONDAY,
//             activityTypeId,
//             genderRestriction: 'mixed',
//             startTime: '09:00',
//             endTime: '10:00',
//             dailyLimit: 10,
//           },
//         ],
//       });

//       const templateId2 = await createTestScheduleTemplate({
//         providerId,
//         month: 2,
//         year: 2024,
//         dailySchedules: [
//           {
//             dayOfWeek: DayOfWeek.MONDAY,
//             activityTypeId,
//             genderRestriction: 'mixed',
//             startTime: '09:00',
//             endTime: '10:00',
//             dailyLimit: 10,
//           },
//         ],
//       });

//       const result = await scheduleMutations.oneFitScheduleTemplatesRemove(
//         undefined,
//         { ids: [templateId1, templateId2] },
//         context,
//       );

//       expect(result.n).toBe(2);

//       const template1 = await context.models.ScheduleTemplate.findOne({
//         _id: templateId1,
//       });
//       const template2 = await context.models.ScheduleTemplate.findOne({
//         _id: templateId2,
//       });

//       expect(template1).toBeNull();
//       expect(template2).toBeNull();
//     });
//   });

//   describe('oneFitScheduleTemplates', () => {
//     it('should query schedule templates with filters', async () => {
//       const context = getTestContext();
//       const providerId = await createTestProvider();
//       const activityTypeId = await createTestActivityType({ providerId });

//       await createTestScheduleTemplate({
//         providerId,
//         month: 1,
//         year: 2024,
//         dailySchedules: [
//           {
//             dayOfWeek: DayOfWeek.MONDAY,
//             activityTypeId,
//             genderRestriction: 'mixed',
//             startTime: '09:00',
//             endTime: '10:00',
//             dailyLimit: 10,
//           },
//         ],
//       });

//       await createTestScheduleTemplate({
//         providerId,
//         month: 2,
//         year: 2024,
//         dailySchedules: [
//           {
//             dayOfWeek: DayOfWeek.MONDAY,
//             activityTypeId,
//             genderRestriction: 'mixed',
//             startTime: '09:00',
//             endTime: '10:00',
//             dailyLimit: 10,
//           },
//         ],
//       });

//       const result = await scheduleQueries.oneFitScheduleTemplates(
//         undefined,
//         { providerId, month: 1, year: 2024 },
//         context,
//       );

//       expect(result.list).toHaveLength(1);
//       expect(result.list[0].month).toBe(1);
//     });

//     it('should filter by activityTypeId', async () => {
//       const context = getTestContext();
//       const providerId = await createTestProvider();
//       const activityTypeId1 = await createTestActivityType({ providerId });
//       const activityTypeId2 = await createTestActivityType({ providerId });

//       await createTestScheduleTemplate({
//         providerId,
//         month: 1,
//         year: 2024,
//         dailySchedules: [
//           {
//             dayOfWeek: DayOfWeek.MONDAY,
//             activityTypeId: activityTypeId1,
//             genderRestriction: 'mixed',
//             startTime: '09:00',
//             endTime: '10:00',
//             dailyLimit: 10,
//           },
//         ],
//       });

//       const result = await scheduleQueries.oneFitScheduleTemplates(
//         undefined,
//         { providerId, activityTypeId: activityTypeId1 },
//         context,
//       );

//       expect(result.list.length).toBeGreaterThan(0);
//     });
//   });

//   describe('oneFitScheduleTemplate', () => {
//     it('should get schedule template by ID', async () => {
//       const context = getTestContext();
//       const providerId = await createTestProvider();
//       const activityTypeId = await createTestActivityType({ providerId });
//       const templateId = await createTestScheduleTemplate({
//         providerId,
//         month: 1,
//         year: 2024,
//         dailySchedules: [
//           {
//             dayOfWeek: DayOfWeek.MONDAY,
//             activityTypeId,
//             genderRestriction: 'mixed',
//             startTime: '09:00',
//             endTime: '10:00',
//             dailyLimit: 10,
//           },
//         ],
//       });

//       const template = await scheduleQueries.oneFitScheduleTemplate(
//         undefined,
//         { _id: templateId },
//         context,
//       );

//       expect(template).toBeDefined();
//       expect(template?._id).toBe(templateId);
//       expect(template?.month).toBe(1);
//     });
//   });

//   describe('oneFitScheduleTemplateByProviderAndMonth', () => {
//     it('should get schedule template by provider and month', async () => {
//       const context = getTestContext();
//       const providerId = await createTestProvider();
//       const activityTypeId = await createTestActivityType({ providerId });

//       await createTestScheduleTemplate({
//         providerId,
//         month: 1,
//         year: 2024,
//         dailySchedules: [
//           {
//             dayOfWeek: DayOfWeek.MONDAY,
//             activityTypeId,
//             genderRestriction: 'mixed',
//             startTime: '09:00',
//             endTime: '10:00',
//             dailyLimit: 10,
//           },
//         ],
//       });

//       const template = await scheduleQueries.oneFitScheduleTemplateByProviderAndMonth(
//         undefined,
//         { providerId, year: 2024, month: 1 },
//         context,
//       );

//       expect(template).toBeDefined();
//       expect(template?.providerId).toBe(providerId);
//       expect(template?.month).toBe(1);
//       expect(template?.year).toBe(2024);
//     });

//     it('should return null if template does not exist', async () => {
//       const context = getTestContext();
//       const providerId = await createTestProvider();

//       const template = await scheduleQueries.oneFitScheduleTemplateByProviderAndMonth(
//         undefined,
//         { providerId, year: 2024, month: 1 },
//         context,
//       );

//       expect(template).toBeNull();
//     });
//   });
// });
