import { RegistrationFormDefinition } from '@/registration/@types/registrationForm';
import { SCHEMA_VERSION_V1 } from '../constants';

export const tourGuideForm: RegistrationFormDefinition = {
  membershipTypeId: 'tour_guide',
  schemaVersion: SCHEMA_VERSION_V1,
  title: 'Жуулчны хөтөч тайлбарлагч',
  description:
    'Сонголт 1: шалгалт 150,000 ₮ · Сонголт 2: гишүүн 300,000 ₮',
  sections: [
    {
      id: 'personal',
      title: 'Хувийн мэдээлэл',
      fields: [
        {
          id: 'registration_option',
          kind: 'select',
          label: 'Бүртгэлийн сонголт',
          required: true,
          options: [
            { value: 'option1_exam', label: 'Сонголт 1 — Шалгалт' },
            { value: 'option2_member', label: 'Сонголт 2 — Гишүүн' },
          ],
        },
        {
          id: 'last_name',
          kind: 'text',
          label: 'Овог (кирилл)',
          required: true,
        },
        {
          id: 'first_name',
          kind: 'text',
          label: 'Нэр (кирилл)',
          required: true,
        },
      ],
    },
    {
      id: 'languages',
      title: 'Хэл мэдлэг',
      fields: [
        {
          id: 'languages',
          kind: 'multiselect',
          label: 'Хэл',
          options: [
            { value: 'de', label: 'Герман' },
            { value: 'ru', label: 'Орос' },
            { value: 'en', label: 'Англи' },
            { value: 'es', label: 'Испани' },
            { value: 'ko', label: 'Солонгос' },
            { value: 'it', label: 'Итали' },
            { value: 'ja', label: 'Япон' },
            { value: 'zh', label: 'Хятад' },
            { value: 'fr', label: 'Франц' },
            { value: 'ar', label: 'Араб' },
            { value: 'tr', label: 'Түрк' },
            { value: 'vi', label: 'Вьетнам' },
            { value: 'th', label: 'Тайланд' },
            { value: 'other', label: 'Бусад' },
          ],
        },
      ],
    },
    {
      id: 'professional',
      title: 'Мэргэжлийн мэдээлэл',
      fields: [
        {
          id: 'guide_experience_years',
          kind: 'select',
          label: 'Хөтөч-тайлбарлагчаар ажилласан хугацаа',
          options: [
            { value: 'first_year', label: 'Анхны жил' },
            { value: '1_3', label: '1-3 жил' },
            { value: '4_6', label: '4-6 жил' },
            { value: '7_9', label: '7-9 жил' },
            { value: '10_plus', label: '10+ жил' },
          ],
        },
        {
          id: 'guide_specialization',
          kind: 'select',
          label: 'Мэргэшсэн чиглэл',
          options: [
            { value: 'general', label: 'Ерөнхий аяллын хөтөч' },
            { value: 'special_interest', label: 'Тусгай сонирхлын аяллын хөтөч' },
            { value: 'local', label: 'Орон нутгийн хөтөч' },
          ],
        },
        {
          id: 'code_of_conduct_ack',
          kind: 'boolean',
          label: 'Хөтөч-тайлбарлагчийн журамтай танилцсан эсэх (MPTGA.org)',
        },
      ],
    },
    {
      id: 'documents',
      title: 'Байршуулах баримт бичгүүд',
      fields: [
        { id: 'doc_photo', kind: 'file', label: 'Зураг (профайл зураг)' },
        {
          id: 'doc_diploma_or_course',
          kind: 'file',
          label: 'АЖ-ын дипломны хуулбар эсвэл хөтөч сургалтын гэрчилгээ',
        },
        {
          id: 'doc_id',
          kind: 'file',
          label: 'Иргэний үнэмлэхний хуулбар',
        },
        {
          id: 'doc_membership_fee',
          kind: 'file',
          label: 'Гишүүний татвар төлсөн баримт',
        },
      ],
    },
    {
      id: 'contact',
      title: 'Холбоо барих мэдээлэл',
      fields: [
        {
          id: 'contact_phone',
          kind: 'text',
          label: 'Холбоо барих утас',
          required: true,
        },
        {
          id: 'contact_email',
          kind: 'text',
          label: 'И-мэйл хаяг',
          required: true,
        },
      ],
    },
  ],
};
