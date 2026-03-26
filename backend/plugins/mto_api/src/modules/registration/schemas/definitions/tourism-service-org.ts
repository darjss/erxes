import { RegistrationFormDefinition } from '@/registration/@types/registrationForm';
import { SCHEMA_VERSION_V1 } from '../constants';

export const tourismServiceOrgForm: RegistrationFormDefinition = {
  membershipTypeId: 'tourism_service_org',
  schemaVersion: SCHEMA_VERSION_V1,
  title: 'Аялал жуулчлалын үйлчилгээний байгууллага',
  description: 'Гишүүний татвар: 1,200,000 ₮ / жил',
  sections: [
    {
      id: 'org_base',
      title: 'Байгууллагын үндсэн мэдээлэл',
      fields: [
        {
          id: 'org_name',
          kind: 'text',
          label: 'Байгууллагын нэр',
          required: true,
        },
        {
          id: 'registration_number',
          kind: 'text',
          label: 'Регистрийн дугаар',
          required: true,
        },
        {
          id: 'activity_started_at',
          kind: 'date',
          label: 'Үйл ажиллагаа эрхэлж эхэлсэн огноо',
        },
        {
          id: 'has_foreign_investment',
          kind: 'boolean',
          label: 'Гадны хөрөнгө оруулалттай эсэх',
        },
        {
          id: 'business_name_en',
          kind: 'text',
          label: 'Бизнесийн үйл ажиллагаа эрхэлдэг нэр',
        },
        {
          id: 'business_address',
          kind: 'textarea',
          label: 'Үйл ажиллагаа эрхэлж буй хаяг',
          required: true,
        },
        {
          id: 'management_info',
          kind: 'textarea',
          label: 'Удирдлагын мэдээлэл',
          required: true,
        },
        {
          id: 'capacity',
          kind: 'text',
          label: 'Хүчин чадал (өрөө, орны тоо)',
        },
        {
          id: 'extra_services',
          kind: 'textarea',
          label: 'Нэмэлт үйлчилгээ',
        },
        {
          id: 'contact_channels',
          kind: 'text',
          label: 'Захиалга/мэдээллийн холбоос',
        },
      ],
    },
    {
      id: 'org_categories',
      title: 'Байгууллагын төрөл',
      fields: [
        {
          id: 'org_categories',
          kind: 'checkbox_group',
          label: 'Төрөл',
          required: true,
          options: [
            { value: 'hotel', label: 'Зочид буудал (Hotel)' },
            { value: 'resort', label: 'Ресорт (Resort)' },
            { value: 'lodge', label: 'Лож (Lodge)' },
            { value: 'tourist_base', label: 'Жуулчны бааз' },
            { value: 'resort_area', label: 'Амралтын газар' },
            { value: 'inn', label: 'Дэн буудал' },
            { value: 'guest_house', label: 'Гэст хаус (Guest House)' },
            { value: 'transport', label: 'Тээвэр' },
            { value: 'food_production', label: 'Хоол үйлдвэрлэл' },
          ],
        },
      ],
    },
    {
      id: 'months_open',
      title: 'Ажилладаг сарууд',
      fields: [
        {
          id: 'open_months',
          kind: 'multiselect',
          label: 'Сар',
          options: Array.from({ length: 12 }, (_, i) => ({
            value: String(i + 1),
            label: `${i + 1} сар`,
          })),
        },
      ],
    },
    {
      id: 'ethics',
      title: 'Аялал жуулчлалын ёс зүйн дүрэм',
      fields: [
        {
          id: 'ethics_acknowledged',
          kind: 'boolean',
          label: 'Ёс зүйн дүрэмтэй танилцсан',
          required: true,
          acknowledgment: true,
        },
      ],
    },
    {
      id: 'documents',
      title: 'Байршуулах баримт бичгүүд',
      fields: [
        {
          id: 'doc_registration',
          kind: 'file',
          label: 'Улсын бүртгэлийн гэрчилгээний хуулбар',
        },
        { id: 'doc_logo', kind: 'file', label: 'Байгууллагын лого' },
        {
          id: 'doc_tax',
          kind: 'file',
          label: 'Татвар төлөгчийн тодорхойлолт',
        },
        {
          id: 'doc_social_insurance',
          kind: 'file',
          label: 'А.А.Н.Б-ын нийгмийн даатгалын шимтгэл төлөлтийн тодорхойлолт',
        },
        {
          id: 'doc_star_rating',
          kind: 'file',
          label: 'Одны зэрэглэл / Тохирлын гэрчилгээний хуулбар',
        },
        {
          id: 'doc_membership_request',
          kind: 'file',
          label: 'АЖМХ-д гишүүнээр элсэх хүсэлт',
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
