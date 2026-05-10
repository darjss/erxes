import { IContext } from '~/connectionResolvers';

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 20);

const buildUniqueSlug = async (
  baseName: string,
  findBySlug: (slug: string) => Promise<unknown>,
) => {
  const baseSlug = slugify(baseName) || 'team';
  let slug = baseSlug;
  let counter = 2;

  while (await findBySlug(slug)) {
    const suffix = `-${counter}`;
    slug = `${baseSlug.slice(0, Math.max(1, 20 - suffix.length))}${suffix}`;
    counter += 1;
  }

  return slug;
};

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

    const slug = await buildUniqueSlug(name, (nextSlug) =>
      models.Identifier.findOne({ slug: nextSlug }).lean(),
    );

    const hadAnyIdentifier = await models.Identifier.exists({});

    const identifier = await models.Identifier.create({
      name,
      slug,
      kind,
      description,
    });

    // Preserve existing singleton deployments by attaching them to the first
    // identifier created in this workspace.
    if (!hadAnyIdentifier) {
      await models.AgentServer.updateMany(
        { orgId: { $exists: false } },
        { $set: { orgId: identifier._id } },
      );
      await models.OpencodeServer.updateMany(
        { orgId: { $exists: false } },
        { $set: { orgId: identifier._id } },
      );
    }

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
