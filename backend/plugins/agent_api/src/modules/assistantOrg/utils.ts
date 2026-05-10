import type { IModels } from '~/connectionResolvers';
import type { TIdentifierKind } from './@types/assistantOrg';

type TLegacyServer = {
  _id: string;
  orgId?: string;
  name?: string;
  agentId?: string;
};

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const isDuplicateKeyError = (error: unknown) => {
  return (
    !!error &&
    typeof error === 'object' &&
    'code' in error &&
    (error as { code?: unknown }).code === 11000
  );
};

const buildLegacyIdentifierSlug = (
  kind: TIdentifierKind,
  serverId: string,
) => {
  const prefix = kind === 'assistant' ? 'legacy-asst' : 'legacy-agent';
  const rawId =
    String(serverId)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(-(20 - prefix.length - 1)) || 'server';

  return `${prefix}-${rawId}`.slice(0, 20);
};

const buildLegacyIdentifierName = (
  kind: TIdentifierKind,
  server: TLegacyServer,
) => {
  const value =
    server.agentId?.trim() || server.name?.trim() || `Migrated ${kind}`;

  return (
    value ||
    (kind === 'assistant' ? 'Migrated AI Assistant' : 'Migrated AI Agent')
  );
};

const buildLegacyIdentifierDescription = (kind: TIdentifierKind) => {
  return kind === 'assistant'
    ? 'Auto-migrated legacy AI assistant deployment.'
    : 'Auto-migrated legacy AI agent deployment.';
};

export const buildUniqueSlug = async (
  baseName: string,
  findBySlug: (slug: string) => Promise<unknown>,
) => {
  const baseSlug = slugify(baseName).slice(0, 20) || 'team';
  let slug = baseSlug;
  let counter = 2;

  while (await findBySlug(slug)) {
    const suffix = `-${counter}`;
    slug = `${baseSlug.slice(0, Math.max(1, 20 - suffix.length))}${suffix}`;
    counter += 1;
  }

  return slug;
};

const findOrCreateLegacyIdentifier = async (
  models: IModels,
  kind: TIdentifierKind,
  server: TLegacyServer,
) => {
  const slug = buildLegacyIdentifierSlug(kind, server._id);
  let identifier: any = await models.Identifier.findOne({ slug }).lean();

  if (identifier) {
    return identifier;
  }

  try {
    identifier = await models.Identifier.create({
      name: buildLegacyIdentifierName(kind, server),
      slug,
      kind,
      description: buildLegacyIdentifierDescription(kind),
    });
  } catch (error) {
    if (!isDuplicateKeyError(error)) {
      throw error;
    }

    identifier = await models.Identifier.findOne({ slug }).lean();
  }

  if (!identifier) {
    throw new Error(`Failed to create legacy ${kind} identifier`);
  }

  return identifier;
};

const ensureServerIdentifier = async ({
  models,
  kind,
  server,
  updateServer,
}: {
  models: IModels;
  kind: TIdentifierKind;
  server: TLegacyServer;
  updateServer: (identifierId: string) => Promise<void>;
}) => {
  const currentOrgId = server.orgId?.trim();

  if (currentOrgId) {
    const identifier = await models.Identifier.findById(currentOrgId).lean();

    if (identifier?.kind === kind) {
      return identifier;
    }

    if (identifier && !identifier.kind) {
      await models.Identifier.updateOne(
        { _id: currentOrgId },
        { $set: { kind } },
      );

      return models.Identifier.findById(currentOrgId).lean();
    }
  }

  const identifier = await findOrCreateLegacyIdentifier(models, kind, server);
  const identifierId = String(identifier._id);

  if (currentOrgId !== identifierId) {
    await updateServer(identifierId);
  }

  return identifier;
};

export const ensureLegacyIdentifierLinks = async (models: IModels) => {
  const [agentServers, opencodeServers] = await Promise.all([
    models.AgentServer.find({}).lean(),
    models.OpencodeServer.find({}).lean(),
  ]);

  for (const server of agentServers) {
    await ensureServerIdentifier({
      models,
      kind: 'assistant',
      server,
      updateServer: async (identifierId) => {
        await models.AgentServer.updateOne(
          { _id: server._id },
          { $set: { orgId: identifierId } },
        );
      },
    });
  }

  for (const server of opencodeServers) {
    await ensureServerIdentifier({
      models,
      kind: 'agent',
      server,
      updateServer: async (identifierId) => {
        await models.OpencodeServer.updateOne(
          { _id: server._id },
          { $set: { orgId: identifierId } },
        );
      },
    });
  }
};
