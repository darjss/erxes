import { channelMutations } from '@/channel/graphql/resolvers/mutations/channel';
import { conversationMutations } from '@/inbox/graphql/resolvers/mutations/conversations';
import { integrationMutations } from '@/inbox/graphql/resolvers/mutations/integrations';
import { widgetMutations } from '@/inbox/graphql/resolvers/mutations/widget';
import callMutations from '@/integrations/call/graphql/resolvers/mutations';
import { facebookMutations } from '@/integrations/facebook/graphql/resolvers/mutations';
import { imapMutations } from '@/integrations/imap/graphql/resolvers/mutations';
import { noteMutations } from '@/ticket/graphql/resolvers/mutations/note';
import { pipelineMutations } from '~/modules/ticket/graphql/resolvers/mutations/pipeline';
import { statusMutations } from '~/modules/ticket/graphql/resolvers/mutations/status';
import { ticketMutations } from '~/modules/ticket/graphql/resolvers/mutations/ticket';

export const mutations = {
  ...channelMutations,
  ...conversationMutations,
  ...integrationMutations,
  ...facebookMutations,
  ...callMutations,
  ...imapMutations,
  ...pipelineMutations,
  ...statusMutations,
  ...ticketMutations,
  ...widgetMutations,
  ...noteMutations,
};
