import { IContext } from '~/connectionResolvers';
import { buildUniqueSlug, ensureLegacyIdentifierLinks } from '../../../utils';

export const identifierMutations = {
  createIdentifier: async (
    _root: undefined,
    {
      input,
    }: {
      input: {
        name: string;
        kind: 'assistant' | 'agent';
        description?: string | null;
      };
    },
    { models }: IContext,
  ) => {
    const name = input?.name?.trim();
    const kind = input?.kind;
    const description = input?.description?.trim() || undefined;

    if (!name) {
      throw new Error('name is required');
    }

    if (kind !== 'assistant' && kind !== 'agent') {
      throw new Error('kind must be assistant or agent');
    }

    await ensureLegacyIdentifierLinks(models);

    const slug = await buildUniqueSlug(name, (nextSlug) =>
      models.Identifier.findOne({ slug: nextSlug }).lean(),
    );

    const identifier = await models.Identifier.create({
      name,
      slug,
      kind,
      description,
    });

    return identifier;
  },

  updateIdentifier: async (
    _root: undefined,
    {
      identifierId,
      input,
    }: {
      identifierId: string;
      input: { name: string; description?: string | null };
    },
    { models }: IContext,
  ) => {
    const name = input?.name?.trim();

    if (!identifierId) {
      throw new Error('identifierId is required');
    }

    if (!name) {
      throw new Error('name is required');
    }

    const existing = await models.Identifier.findById(identifierId).lean();

    if (!existing) {
      throw new Error('Identifier not found');
    }

    return models.Identifier.findByIdAndUpdate(
      identifierId,
      {
        $set: {
          name,
          description: input?.description?.trim() || '',
        },
      },
      { new: true },
    ).lean();
  },

  deleteIdentifier: async (
    _root: undefined,
    { identifierId }: { identifierId: string },
    { models }: IContext,
  ) => {
    if (!identifierId) {
      throw new Error('identifierId is required');
    }

    const existing = await models.Identifier.findById(identifierId).lean();

    if (!existing) {
      throw new Error('Identifier not found');
    }

    const [agentServer, opencodeServer] = await Promise.all([
      models.AgentServer.exists({ orgId: identifierId }),
      models.OpencodeServer.exists({ orgId: identifierId }),
    ]);

    if (agentServer || opencodeServer) {
      throw new Error(
        'Destroy this identifier deployment before deleting it.',
      );
    }

    await models.Identifier.deleteOne({ _id: identifierId });

    return true;
  },
};
