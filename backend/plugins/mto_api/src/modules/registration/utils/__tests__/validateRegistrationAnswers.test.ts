import { validateRegistrationAnswers } from '@/registration/utils/validateRegistrationAnswers';
import { getDefaultRegistrationFormDefinitions } from '@/registration/schemas/registry';

function getDefaultDefinition(membershipTypeId: string, schemaVersion: string) {
  return getDefaultRegistrationFormDefinitions().find(
    (d) =>
      d.membershipTypeId === membershipTypeId &&
      d.schemaVersion === schemaVersion,
  );
}

describe('validateRegistrationAnswers', () => {
  it('rejects unknown keys', () => {
    const def = getDefaultDefinition('tour_guide', '2026-03-26');
    expect(def).toBeTruthy();
    const result = validateRegistrationAnswers(def!, {
      unknown_field: 'x',
      ...minimalValidGuideAnswers(),
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('Unknown field'))).toBe(true);
  });

  it('accepts minimal valid tour_guide answers', () => {
    const def = getDefaultDefinition('tour_guide', '2026-03-26');
    expect(def).toBeTruthy();
    const result = validateRegistrationAnswers(
      def!,
      minimalValidGuideAnswers(),
    );
    expect(result.valid).toBe(true);
  });

  it('requires acknowledgment boolean to be true when set', () => {
    const def = getDefaultDefinition('local_community', '2026-03-26');
    expect(def).toBeTruthy();
    const base = minimalValidLocalCommunityAnswers();
    const result = validateRegistrationAnswers(def!, {
      ...base,
      ethics_acknowledged: false,
    });
    expect(result.valid).toBe(false);
  });
});

function minimalValidGuideAnswers(): Record<string, unknown> {
  return {
    registration_option: 'option1_exam',
    last_name: 'Тест',
    first_name: 'Тест',
    languages: ['en'],
    guide_experience_years: '1_3',
    guide_specialization: 'general',
    code_of_conduct_ack: false,
    doc_photo: 'https://example.com/a.jpg',
    doc_diploma_or_course: 'https://example.com/b.jpg',
    doc_id: 'https://example.com/c.jpg',
    doc_membership_fee: 'https://example.com/d.jpg',
    contact_phone: '99119911',
    contact_email: 'a@example.com',
  };
}

function minimalValidLocalCommunityAnswers(): Record<string, unknown> {
  return {
    last_name: 'Тест',
    first_name: 'Тест',
    ngo_name: '',
    branch_association_name: '',
    activity_started_at: '2020-01-01',
    business_address: 'УБ',
    contact_channels: '',
    service_types: ['tbb_members'],
    ethics_acknowledged: true,
    doc_id_or_ngo: 'https://example.com/a.jpg',
    doc_membership_request: 'https://example.com/b.jpg',
    doc_membership_fee: 'https://example.com/c.jpg',
    contact_phone: '99119911',
    contact_email: 'a@example.com',
  };
}
