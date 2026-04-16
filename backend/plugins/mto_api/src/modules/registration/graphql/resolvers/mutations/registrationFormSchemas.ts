import { Resolver } from 'erxes-api-shared/core-types';
import { markResolvers } from 'erxes-api-shared/utils';
import { RegistrationFormDefinition } from '@/registration/@types/registrationForm';
import { assertErxesUser } from '@/registration/graphql/utils/registrationAuth';
import { IContext } from '~/connectionResolvers';

function toDefinition(input: unknown): RegistrationFormDefinition {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Invalid definition payload');
  }

  const doc = input as Record<string, unknown>;
  const normalized: RegistrationFormDefinition = {
    membershipTypeId: String(doc.membershipTypeId ?? '').trim(),
    schemaVersion: String(doc.schemaVersion ?? '').trim(),
    title: String(doc.title ?? '').trim(),
    description:
      doc.description === undefined || doc.description === null
        ? undefined
        : String(doc.description),
    sections: Array.isArray(doc.sections)
      ? (doc.sections as RegistrationFormDefinition['sections'])
      : [],
  };

  if (
    !normalized.membershipTypeId ||
    !normalized.schemaVersion ||
    !normalized.title
  ) {
    throw new Error(
      'membershipTypeId, schemaVersion and title are required in definition payload',
    );
  }

  if (!Array.isArray(normalized.sections) || normalized.sections.length === 0) {
    throw new Error('definition.sections must be a non-empty array');
  }

  return normalized;
}

export const registrationFormSchemaMutations: Record<string, Resolver> = {
  async mtoRegistrationFormSchemaCreate(
    _root: undefined,
    { definition }: { definition: unknown },
    context: IContext,
  ) {
    assertErxesUser(context);
    const doc = toDefinition(definition);
    const { models } = context;

    const existing = await models.RegistrationFormSchema.findOne({
      membershipTypeId: doc.membershipTypeId,
      schemaVersion: doc.schemaVersion,
    }).lean();
    if (existing) {
      throw new Error(
        'Schema with this membershipTypeId + schemaVersion already exists',
      );
    }

    const created = await models.RegistrationFormSchema.createSchema(doc);
    return {
      ...created.toObject(),
      applicationsCount: 0,
    };
  },

  async mtoRegistrationFormSchemaUpdate(
    _root: undefined,
    { _id, definition }: { _id: string; definition: unknown },
    context: IContext,
  ) {
    assertErxesUser(context);
    const doc = toDefinition(definition);
    const { models } = context;

    const conflict = await models.RegistrationFormSchema.findOne({
      _id: { $ne: _id },
      membershipTypeId: doc.membershipTypeId,
      schemaVersion: doc.schemaVersion,
    }).lean();
    if (conflict) {
      throw new Error(
        'Schema with this membershipTypeId + schemaVersion already exists',
      );
    }

    const updated = await models.RegistrationFormSchema.updateSchemaById(
      _id,
      doc,
    );
    if (!updated) throw new Error('Schema not found');

    return {
      ...updated.toObject(),
      applicationsCount: await models.RegistrationApplication.countDocuments({
        membershipTypeId: updated.membershipTypeId,
        schemaVersion: updated.schemaVersion,
      }),
    };
  },

  async mtoRegistrationFormSchemaRemove(
    _root: undefined,
    { _id }: { _id: string },
    context: IContext,
  ) {
    assertErxesUser(context);
    const { models } = context;
    const target = await models.RegistrationFormSchema.findOne({ _id }).lean();
    if (!target) throw new Error('Schema not found');

    const usedCount = await models.RegistrationApplication.countDocuments({
      membershipTypeId: target.membershipTypeId,
      schemaVersion: target.schemaVersion,
    });
    if (usedCount > 0) {
      throw new Error('Cannot delete schema that already has applications');
    }

    await models.RegistrationFormSchema.removeSchemaById(_id);
    return { success: true };
  },
};

markResolvers(registrationFormSchemaMutations, {
  wrapperConfig: {
    skipPermission: true,
  },
});
