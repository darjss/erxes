import { Queue } from 'bullmq';
import { Job } from 'bullmq';
import {
  createMQWorkerWithListeners,
  getEnv,
  getSaasOrganizations,
  sendWorkerQueue,
} from 'erxes-api-shared/utils';
import { generateModels } from '~/connectionResolvers';
import { processCreditExpiration } from './creditExpiration';
import { processBookingNoShow } from './bookingNoShow';

export const mainScheduler = async () => {
  const VERSION = getEnv({ name: 'VERSION' });

  if (VERSION && VERSION === 'saas') {
    const orgs = await getSaasOrganizations();

    // for (const org of orgs) {
    //   sendWorkerQueue('onefit', 'credit-expiration').add('credit-expiration', {
    //     subdomain: org.subdomain,
    //     timezone: org.timezone,
    //   });
    // }

    return 'success';
  } else {
    sendWorkerQueue('onefit', 'credit-expiration').add('credit-expiration', {
      subdomain: 'os',
      timezone: 'UTC',
    });
    return 'success';
  }
};

export const runner = async (job: Job) => {
  const { subdomain } = job?.data ?? {};
  // console.log('job?.data', job?.data);
  // if (!subdomain) {
  //   throw new Error('Subdomain is required for credit expiration worker');
  // }

  const models = await generateModels(subdomain);
  await processCreditExpiration(models, subdomain);

  console.log(
    `Credit expiration processed at: ${new Date()}, org: ${subdomain}`,
  );
};

export const bookingNoShowScheduler = async () => {
  const VERSION = getEnv({ name: 'VERSION' });

  if (VERSION && VERSION === 'saas') {
    // const orgs = await getSaasOrganizations();

    // for (const org of orgs) {
    //   sendWorkerQueue('onefit', 'booking-no-show').add('booking-no-show', {
    //     subdomain: org.subdomain,
    //   });
    // }

    return 'success';
  } else {
    sendWorkerQueue('onefit', 'booking-no-show').add('booking-no-show', {
      subdomain: 'os',
    });
    return 'success';
  }
};

export const bookingNoShowRunner = async (job: Job) => {
  const { subdomain } = job?.data ?? {};
  console.log(
    `################### Booking no-show processed at: ${new Date()}, org: ${subdomain}`,
  );
  const models = await generateModels(subdomain);
  await processBookingNoShow(models, subdomain);
};

export const initMQWorkers = async (redis: any) => {
  const myQueue = new Queue('onefit-credit-expiration', {
    connection: redis,
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: true,
    },
  });

  // Schedule to run daily at midnight UTC
  await myQueue.upsertJobScheduler(
    'onefit-daily-credit-expiration',
    {
      // pattern: '0 0 * * *',
      pattern: '0 * * * *',
      tz: 'UTC',
    },
    {
      name: 'onefit-credit-expiration',
    },
  );

  createMQWorkerWithListeners(
    'onefit',
    'credit-expiration',
    runner,
    redis,
    () => {
      console.log('Worker for queue onefit-credit-expiration is ready');
    },
  );

  createMQWorkerWithListeners(
    'onefit',
    'daily-credit-expiration',
    mainScheduler,
    redis,
    () => {
      console.log('Worker for queue onefit-daily-credit-expiration is ready');
    },
  );

  const bookingNoShowSchedulerQueue = new Queue(
    'onefit-daily-booking-no-show',
    {
      connection: redis,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    },
  );

  await bookingNoShowSchedulerQueue.upsertJobScheduler(
    'onefit-daily-booking-no-show',
    {
      pattern: '0 * * * *',
      tz: 'UTC',
    },
    {
      name: 'onefit-booking-no-show',
    },
  );

  createMQWorkerWithListeners(
    'onefit',
    'booking-no-show',
    bookingNoShowRunner,
    redis,
    () => {
      console.log('Worker for queue onefit-booking-no-show is ready');
    },
  );

  createMQWorkerWithListeners(
    'onefit',
    'daily-booking-no-show',
    bookingNoShowScheduler,
    redis,
    () => {
      console.log('Worker for queue onefit-daily-booking-no-show is ready');
    },
  );
};
