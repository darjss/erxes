import { RegistrationFieldOption } from '@/registration/@types/registrationForm';

/** Aimags / Ulaanbaatar for multiselects (doc: аялал зохион байгуулдаг аймгууд) */
export const MONGOLIA_PROVINCE_OPTIONS: RegistrationFieldOption[] = [
  { value: 'arkhangai', label: 'Архангай' },
  { value: 'bayankhongor', label: 'Баянхонгор' },
  { value: 'bayan_olgii', label: 'Баян-Өлгий' },
  { value: 'bulgan', label: 'Булган' },
  { value: 'gobi_altai', label: 'Говь-Алтай' },
  { value: 'gobi_sumber', label: 'Говь Сүмбэр' },
  { value: 'darkhan_uul', label: 'Дархан Уул' },
  { value: 'dornogovi', label: 'Дорноговь' },
  { value: 'dornod', label: 'Дорнод' },
  { value: 'dundgovi', label: 'Дундговь' },
  { value: 'zavkhan', label: 'Завхан' },
  { value: 'orkhon', label: 'Орхон' },
  { value: 'uvurkhangai', label: 'Өвөрхангай' },
  { value: 'umnugovi', label: 'Өмнөговь' },
  { value: 'sukhbaatar', label: 'Сүхбаатар' },
  { value: 'selenge', label: 'Сэлэнгэ' },
  { value: 'tuv', label: 'Төв' },
  { value: 'uvs', label: 'Увс' },
  { value: 'khovd', label: 'Ховд' },
  { value: 'khuvsgul', label: 'Хөвсгөл' },
  { value: 'khentii', label: 'Хэнтий' },
  { value: 'ulaanbaatar', label: 'Улаанбаатар' },
];

export const SCHEMA_VERSION_V1 = '2026-03-26';
