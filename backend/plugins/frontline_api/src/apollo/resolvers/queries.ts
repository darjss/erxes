import { channelQueries } from '@/channel/graphql/resolvers/queries/channel';
import { conversationQueries } from '@/inbox/graphql/resolvers/queries/conversations';
import { integrationQueries } from '@/inbox/graphql/resolvers/queries/integrations';
import { widgetQueries } from '@/inbox/graphql/resolvers/queries/widget';
import callQueries from '@/integrations/call/graphql/resolvers/queries';
import { facebookQueries } from '@/integrations/facebook/graphql/resolvers/queries';
import { imapQueries } from '@/integrations/imap/graphql/resolvers/queries';
import { noteQueries } from '@/ticket/graphql/resolvers/queries/note';
import { pipelineQueries } from '@/ticket/graphql/resolvers/queries/pipeline';
import { statusQueries } from '@/ticket/graphql/resolvers/queries/status';
import { activityQueries } from '~/modules/ticket/graphql/resolvers/queries/activity';
import { ticketQueries } from '~/modules/ticket/graphql/resolvers/queries/ticket';

export const queries = {
  ...channelQueries,
  ...conversationQueries,
  ...integrationQueries,
  ...facebookQueries,
  ...callQueries,
  ...imapQueries,
  ...pipelineQueries,
  ...statusQueries,
  ...ticketQueries,
  ...widgetQueries,
  ...activityQueries,
  ...noteQueries,
};
