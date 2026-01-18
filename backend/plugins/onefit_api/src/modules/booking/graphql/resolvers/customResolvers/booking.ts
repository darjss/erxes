import { IBookingDocument } from '@/booking/@types/booking';
import { IContext } from '~/connectionResolvers';

const bookingCustomResolvers = {
  OneFitBooking: {
    user: async (
      booking: IBookingDocument,
      _params: undefined,
      { models }: IContext,
    ) => {
      if (!booking.userId) {
        return null;
      }
      return await models.OneFitCustomer.findOne({ _id: booking.userId });
    },

    provider: async (
      booking: IBookingDocument,
      _params: undefined,
      { models }: IContext,
    ) => {
      if (!booking.providerId) {
        return null;
      }
      return await models.Provider.findOne({ _id: booking.providerId });
    },

    activityType: async (
      booking: IBookingDocument,
      _params: undefined,
      { models }: IContext,
    ) => {
      if (!booking.activityTypeId) {
        return null;
      }
      return await models.ActivityType.findOne({ _id: booking.activityTypeId });
    },
  },
};

export default bookingCustomResolvers;

