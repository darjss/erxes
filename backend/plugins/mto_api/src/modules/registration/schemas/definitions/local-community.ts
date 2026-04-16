import { RegistrationFormDefinition } from '@/registration/@types/registrationForm';
import { SCHEMA_VERSION_V1 } from '../constants';

export const localCommunityForm: RegistrationFormDefinition = {
  membershipTypeId: 'local_community',
  schemaVersion: SCHEMA_VERSION_V1,
  title: 'Нутгийн иргэдэд түшиглэсэн аялал жуулчлал эрхлэгчид болон ТББ',
  description:
    'Гишүүний татвар: 1,200,000 ₮ (байгууллага) · 300,000 ₮ (хувь хүн). Гүйлгээний утга: ТББ эсвэл Салбар холбооны нэр · РД · Утасны дугаар',
  sections: [
    {
      id: 'personal',
      title: 'Хувийн мэдээлэл',
      fields: [
        {
          id: 'last_name',
          kind: 'text',
          label: 'Овог',
          required: true,
        },
        {
          id: 'first_name',
          kind: 'text',
          label: 'Нэр',
          required: true,
        },
      ],
    },
    {
      id: 'activity',
      title: 'Үйл ажиллагааны мэдээлэл',
      fields: [
        {
          id: 'ngo_name',
          kind: 'text',
          label: 'ТББ бол нэрийг бичнэ үү',
        },
        {
          id: 'branch_association_name',
          kind: 'text',
          label: 'Аймгийн АЖХолбоог бичнэ үү',
        },
        {
          id: 'activity_started_at',
          kind: 'date',
          label: 'Бүтээгдэхүүн, үйлчилгээ эрхэлж эхэлсэн огноо',
        },
        {
          id: 'business_address',
          kind: 'textarea',
          label: 'Үйл ажиллагаа эрхэлж буй хаяг',
          required: true,
        },
        {
          id: 'contact_channels',
          kind: 'text',
          label: 'Захиалга/мэдээллийн холбоос',
        },
      ],
    },
    {
      id: 'law_11_service',
      title: 'Үйлчилгээний төрөл (Аялал жуулчлалын тухай хуулийн 11-р зүйл)',
      fields: [
        {
          id: 'service_types',
          kind: 'checkbox_group',
          label: 'Төрөл',
          required: true,
          options: [
            { value: 'tbb_members', label: 'ТББ — гишүүддээ үйлчилдэг' },
            { value: 'tbb_public', label: 'ТББ — нийтэд үйлчилдэг' },
            {
              value: 'branch_member',
              label: 'Аймгийн АЖХолбооны гишүүн (байгууллага эсвэл хувь хүн)',
            },
            {
              value: 'nomad_culture',
              label: 'Нүүдэлчин соёл, ахуй, зан заншлыг танилцуулдаг',
            },
            { value: 'guest_house', label: 'Зочны гэр' },
            { value: 'yurt', label: 'Ердийн хөсөг' },
            { value: 'side_products', label: 'Дагалдах бүтээгдэхүүн' },
          ],
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
          label: 'Аялал жуулчлалын салбарын ёс зүйн дүрэмтэй танилцсан эсэх',
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
          id: 'doc_id_or_ngo',
          kind: 'file',
          label: 'Иргэний үнэмлэх эсвэл ТББ-ийн гэрчилгээний хуулбар',
        },
        {
          id: 'doc_membership_request',
          kind: 'file',
          label: 'АЖМХ-д гишүүнээр элсэх хүсэлт (өргөдөл)',
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
