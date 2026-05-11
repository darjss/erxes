import {
  IconBook2,
  IconBriefcase,
  IconPalette,
  IconScale,
} from '@tabler/icons-react';

export const LOCKED_COMPANY_BRAIN_MODULES = [
  {
    slug: 'ceo-team',
    name: 'AI for CEO Team',
    icon: IconBriefcase,
    description:
      'Preview strategic briefings, board summaries, and decision support workflows.',
  },
  {
    slug: 'design-department',
    name: 'AI Design Department',
    icon: IconPalette,
    description:
      'Preview creative production queues, design systems, and campaign concept boards.',
  },
  {
    slug: 'knowledge-hub',
    name: 'AI Knowledge Hub',
    icon: IconBook2,
    description:
      'Preview connected playbooks, research archives, and organizational memory.',
  },
  {
    slug: 'legal-department',
    name: 'AI Legal Department',
    icon: IconScale,
    description:
      'Preview contract reviews, policy checklists, and compliance workflows.',
  },
] as const;

export type LockedCompanyBrainModuleSlug =
  (typeof LOCKED_COMPANY_BRAIN_MODULES)[number]['slug'];

export const LOCKED_COMPANY_BRAIN_MODULE_MAP = Object.fromEntries(
  LOCKED_COMPANY_BRAIN_MODULES.map((module) => [module.slug, module]),
) as Record<
  LockedCompanyBrainModuleSlug,
  (typeof LOCKED_COMPANY_BRAIN_MODULES)[number]
>;

export const isLockedCompanyBrainModuleSlug = (
  value?: string,
): value is LockedCompanyBrainModuleSlug => {
  return !!value && value in LOCKED_COMPANY_BRAIN_MODULE_MAP;
};
