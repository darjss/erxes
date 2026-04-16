import {
  RegistrationField,
  RegistrationFieldKind,
  RegistrationFormDefinition,
  RegistrationSection,
} from '@/registration/@types/registrationForm';

function flattenFields(sections: RegistrationSection[]): RegistrationField[] {
  return sections.flatMap((s) => s.fields);
}

function isEmptyValue(field: RegistrationField, value: unknown): boolean {
  const kind = field.kind;
  if (kind === 'boolean') {
    if (value === undefined || value === null) return true;
    if (field.required && field.acknowledgment) return value !== true;
    return false;
  }
  if (value === undefined || value === null) return true;
  if (value === '') return true;
  if (
    kind === 'checkbox_group' ||
    kind === 'multiselect' ||
    kind === 'file_list'
  ) {
    return !Array.isArray(value) || value.length === 0;
  }
  return false;
}

function allowedOptionValues(
  field: RegistrationField,
): Set<string> | undefined {
  if (!field.options?.length) return undefined;
  return new Set(field.options.map((o) => o.value));
}

function validateFieldValue(
  field: RegistrationField,
  value: unknown,
): string | null {
  if (isEmptyValue(field, value)) {
    return field.required ? `Required field missing: ${field.id}` : null;
  }

  switch (field.kind) {
    case 'text':
    case 'textarea': {
      if (typeof value !== 'string') {
        return `Field ${field.id} must be a string`;
      }
      const v = field.validation;
      if (v?.minLength !== undefined && value.length < v.minLength) {
        return `Field ${field.id} is too short`;
      }
      if (v?.maxLength !== undefined && value.length > v.maxLength) {
        return `Field ${field.id} is too long`;
      }
      if (v?.pattern) {
        const re = new RegExp(v.pattern);
        if (!re.test(value)) {
          return `Field ${field.id} has invalid format`;
        }
      }
      return null;
    }
    case 'date': {
      if (typeof value !== 'string') {
        return `Field ${field.id} must be a string (ISO date)`;
      }
      return null;
    }
    case 'boolean': {
      if (typeof value !== 'boolean') {
        return `Field ${field.id} must be a boolean`;
      }
      if (field.required && field.acknowledgment && value !== true) {
        return `Field ${field.id} must be accepted`;
      }
      return null;
    }
    case 'select': {
      if (typeof value !== 'string') {
        return `Field ${field.id} must be a string`;
      }
      const allowed = allowedOptionValues(field);
      if (allowed && !allowed.has(value)) {
        return `Field ${field.id} has invalid option`;
      }
      return null;
    }
    case 'multiselect':
    case 'checkbox_group': {
      if (!Array.isArray(value)) {
        return `Field ${field.id} must be an array of strings`;
      }
      if (!value.every((x) => typeof x === 'string')) {
        return `Field ${field.id} must be an array of strings`;
      }
      const allowed = allowedOptionValues(field);
      if (allowed) {
        for (const x of value) {
          if (!allowed.has(x)) {
            return `Field ${field.id} has invalid option: ${x}`;
          }
        }
      }
      return null;
    }
    case 'file': {
      if (typeof value !== 'string') {
        return `Field ${field.id} must be a string (file URL)`;
      }
      return null;
    }
    case 'file_list': {
      if (!Array.isArray(value)) {
        return `Field ${field.id} must be an array of strings`;
      }
      if (!value.every((x) => typeof x === 'string')) {
        return `Field ${field.id} must be an array of file URLs`;
      }
      return null;
    }
    default:
      return `Unknown field kind for ${field.id}`;
  }
}

export interface ValidateRegistrationAnswersResult {
  valid: boolean;
  errors: string[];
}

export function validateRegistrationAnswers(
  definition: RegistrationFormDefinition,
  answers: Record<string, unknown>,
): ValidateRegistrationAnswersResult {
  const errors: string[] = [];
  const fields = flattenFields(definition.sections);
  const allowedIds = new Set(fields.map((f) => f.id));

  for (const key of Object.keys(answers)) {
    if (!allowedIds.has(key)) {
      errors.push(`Unknown field: ${key}`);
    }
  }

  for (const field of fields) {
    const value = answers[field.id];
    const err = validateFieldValue(field, value);
    if (err) errors.push(err);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
