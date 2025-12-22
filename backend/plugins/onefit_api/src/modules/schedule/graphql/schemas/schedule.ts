import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const types = `
  enum OneFitDayOfWeek {
    monday
    tuesday
    wednesday
    thursday
    friday
    saturday
    sunday
  }

  type OneFitDailySchedule {
    dayOfWeek: OneFitDayOfWeek!
    activityTypeId: String!
    genderRestriction: String!
    startTime: String!
    endTime: String!
    dailyLimit: Int!
  }

  type OneFitScheduleTemplate {
    _id: String
    createdAt: Date
    modifiedAt: Date
    providerId: String
    provider: OneFitProvider
    month: Int
    year: Int
    dailySchedules: [OneFitDailySchedule]
  }

  type OneFitScheduleTemplateListResponse {
    list: [OneFitScheduleTemplate]
    pageInfo: PageInfo
    totalCount: Int
  }

  type OneFitScheduleException {
    _id: String
    createdAt: Date
    providerId: String
    provider: OneFitProvider
    date: Date
    reason: String
    activityTypeId: String
  }

  type OneFitScheduleExceptionListResponse {
    list: [OneFitScheduleException]
    pageInfo: PageInfo
    totalCount: Int
  }

  type OneFitDayAvailability {
    date: Date!
    isFull: Boolean!
    seatsLeft: Int!
    totalSeats: Int!
    bookedSeats: Int!
    hasSchedule: Boolean!
  }

  type OneFitMonthAvailability {
    year: Int!
    month: Int!
    days: [OneFitDayAvailability]!
  }

  input OneFitDailyScheduleInput {
    dayOfWeek: OneFitDayOfWeek!
    activityTypeId: String!
    genderRestriction: String!
    startTime: String!
    endTime: String!
    dailyLimit: Int!
  }
`;

const scheduleQueryParams = `
  providerId: String,
  year: Int,
  month: Int,
  activityTypeId: String,
`;

const exceptionQueryParams = `
  providerId: String,
  startDate: Date,
  endDate: Date,
  activityTypeId: String,
`;

export const queries = `
  oneFitScheduleTemplates(${scheduleQueryParams}, ${GQL_CURSOR_PARAM_DEFS}): OneFitScheduleTemplateListResponse
  oneFitScheduleTemplatesCount(${scheduleQueryParams}): Int
  oneFitScheduleTemplate(_id: String): OneFitScheduleTemplate
  oneFitScheduleTemplateByProviderAndMonth(providerId: String!, year: Int!, month: Int!): OneFitScheduleTemplate
  oneFitScheduleExceptions(${exceptionQueryParams}, ${GQL_CURSOR_PARAM_DEFS}): OneFitScheduleExceptionListResponse
  oneFitScheduleExceptionsCount(${exceptionQueryParams}): Int
  oneFitScheduleException(_id: String): OneFitScheduleException
  oneFitMonthAvailability(providerId: String!, activityTypeId: String!, year: Int!, month: Int!, lastDays: Int): OneFitMonthAvailability
`;

const scheduleTemplateInput = `
  providerId: String!
  month: Int!
  year: Int!
  dailySchedules: [OneFitDailyScheduleInput]!
`;

const scheduleTemplateUpdateInput = `
  dailySchedules: [OneFitDailyScheduleInput]
`;

const exceptionInput = `
  providerId: String!
  date: Date!
  reason: String
  activityTypeId: String
`;

export const mutations = `
  oneFitScheduleTemplateCreate(${scheduleTemplateInput}): OneFitScheduleTemplate
  oneFitScheduleTemplateUpdate(_id: String!, ${scheduleTemplateUpdateInput}): OneFitScheduleTemplate
  oneFitScheduleTemplateCopyPreviousMonth(providerIds: [String]!, fromYear: Int!, fromMonth: Int!, toYear: Int!, toMonth: Int!): [OneFitScheduleTemplate]
  oneFitScheduleTemplatesRemove(ids: [String]!): JSON
  oneFitScheduleExceptionCreate(${exceptionInput}): OneFitScheduleException
  oneFitScheduleExceptionRemove(_id: String!): JSON
  oneFitScheduleExceptionsRemove(ids: [String]!): JSON
`;
