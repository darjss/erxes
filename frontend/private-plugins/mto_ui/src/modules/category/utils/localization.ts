import {
  MtoMultilingualString,
  MtoMultilingualStringOptional,
} from '../types/category';

export function getLocalizedString(
  localized:
    | MtoMultilingualString
    | MtoMultilingualStringOptional
    | undefined,
  preferredLang?: 'en' | 'mn',
): string {
  if (!localized || typeof localized !== 'object') {
    return '';
  }
  if (preferredLang && localized[preferredLang]) {
    return localized[preferredLang]!;
  }
  if (localized.en) {
    return localized.en;
  }
  if (localized.mn) {
    return localized.mn;
  }
  const values = Object.values(localized);
  const firstValue = values.find((v) => typeof v === 'string' && v.length > 0);
  if (firstValue) {
    return firstValue as string;
  }
  return '';
}
