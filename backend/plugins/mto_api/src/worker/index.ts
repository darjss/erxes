/**
 * Background workers for booking/credit flows are not registered in this build
 * (those domains live in the full onefit stack). Hook BullMQ schedulers here when needed.
 */
export const initMQWorkers = async (_redis: unknown) => {
  return undefined;
};
