import { RegistrationFormDefinition } from '@/registration/types/registrationForm';

export function defaultValuesFromDefinition(
  definition: RegistrationFormDefinition,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const section of definition.sections) {
    for (const field of section.fields) {
      switch (field.kind) {
        case 'text':
        case 'textarea':
        case 'date':
        case 'select':
        case 'file':
          out[field.id] = '';
          break;
        case 'boolean':
          out[field.id] = false;
          break;
        case 'multiselect':
        case 'checkbox_group':
        case 'file_list':
          out[field.id] = [];
          break;
        default:
          out[field.id] = '';
      }
    }
  }
  return out;
}
