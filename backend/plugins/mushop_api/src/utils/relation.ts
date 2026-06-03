import { sendTRPCMessage } from 'erxes-api-shared/utils';

export interface IRelationEntity {
  contentType: string;
  contentId: string;
}

interface IRelation {
  _id: string;
  entities?: IRelationEntity[];
}

const isSame = (a: IRelationEntity, b: IRelationEntity): boolean =>
  a.contentType === b.contentType && a.contentId === b.contentId;

const has = (list: IRelationEntity[], item: IRelationEntity): boolean =>
  list.some((e) => isSame(e, item));

export const getRelationsByEntity = async (
  subdomain: string,
  entity: IRelationEntity,
): Promise<IRelation[]> =>
  (await sendTRPCMessage({
    subdomain,
    pluginName: 'core',
    method: 'query',
    module: 'relation',
    action: 'getRelationsByEntities',
    input: {
      contentType: entity.contentType,
      contentId: entity.contentId,
    },
  })) ?? [];

export const linkRelation = async ({
  subdomain,
  entities,
  match,
}: {
  subdomain: string;
  entities: IRelationEntity[];
  match?: IRelationEntity[];
}): Promise<void> => {
  if (match?.length) {
    const found = await getRelationsByEntity(subdomain, match[0]);

    const relation = found.find((rel) =>
      match.every((m) => has(rel.entities ?? [], m)),
    );

    if (relation) {
      const existing = relation.entities ?? [];

      const extra = entities.filter((e) => !has(existing, e));

      if (!extra.length) {
        return;
      }

      await sendTRPCMessage({
        subdomain,
        pluginName: 'core',
        method: 'mutation',
        module: 'relation',
        action: 'updateRelation',
        input: {
          _id: relation._id,
          doc: { entities: [...existing, ...extra] },
        },
      });

      return;
    }
  }

  await sendTRPCMessage({
    subdomain,
    pluginName: 'core',
    method: 'mutation',
    module: 'relation',
    action: 'createMultipleRelations',
    input: {
      relations: [{ entities }],
    },
  });
};
