import { markResolvers, sendTRPCMessage } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { ILead, ISubmission } from '../@types';

export const submissionMutation = {
  blockAdminSubmitForm: async (
    _root: undefined,
    { input }: { input: ISubmission & ILead },
    { models, subdomain }: IContext,
  ) => {
    const { name, phone, email, ...submission } = input;

    await sendTRPCMessage({
      subdomain,
      pluginName: 'core',
      method: 'mutation',
      module: 'customers',
      action: 'createOrUpdate',
      input: {
        doc: {
          rows: [
            {
              selector: {
                $and: [{ primaryPhone: phone }, { primaryEmail: email }],
              },
              doc: {
                primaryPhone: phone,
                primaryEmail: email,
                firstName: name,
                state: 'lead',
              },
            },
          ],
          doNotReplaceExistingValues: true,
        },
      },
      defaultValue: {},
    });

    const contact = await sendTRPCMessage({
      subdomain,
      pluginName: 'core',
      method: 'query',
      module: 'customers',
      action: 'findOne',
      input: {
        query: {
          customerPrimaryEmail: email,
          customerPrimaryPhone: phone,
        },
      },
      defaultValue: {},
    });

    console.log('contact', contact);

    if (contact && contact?._id) {
      submission['userId'] = contact._id;
    }

    return models.Submission.createSubmission(submission);
  },
};

markResolvers(submissionMutation, {
  wrapperConfig: {
    forClientPortal: true,
  },
});
