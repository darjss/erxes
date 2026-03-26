import { RegistrationFormDefinition } from '@/registration/@types/registrationForm';
import { SCHEMA_VERSION_V1 } from '../constants';

export const travelAgentForm: RegistrationFormDefinition = {
  membershipTypeId: 'travel_agent',
  schemaVersion: SCHEMA_VERSION_V1,
  title: 'Аяллын агент',
  description: 'Гишүүний татвар: 1,200,000 ₮ / жил',
  sections: [
    {
      id: 'org_base',
      title: 'Байгууллагын үндсэн мэдээлэл',
      fields: [
        {
          id: 'legal_entity_name',
          kind: 'text',
          label: 'Хуулийн этгээдийн нэр',
          required: true,
        },
        {
          id: 'registration_number',
          kind: 'text',
          label: 'Регистрийн дугаар',
          required: true,
        },
        {
          id: 'org_type',
          kind: 'select',
          label: 'Байгууллагын төрөл',
          required: true,
          options: [
            { value: 'partnership', label: 'Нөхөрлөл' },
            { value: 'company', label: 'Компани' },
            { value: 'association', label: 'Холбоо' },
            { value: 'ngo', label: 'ТББ' },
            { value: 'foundation', label: 'Сан' },
            { value: 'cooperative', label: 'Хоршоо' },
            { value: 'religious', label: 'Шашны байгууллага' },
            { value: 'government', label: 'Төрийн байгууллага' },
            { value: 'state_industry', label: 'Улсын төсөвт үйлдвэрийн газар' },
            { value: 'commercial_industry', label: 'Аж ахуйн тооцоот үйлдвэрийн газар' },
            {
              value: 'natural_resource_coop',
              label: 'Байгалийн нөөцийн менежементийн нөхөрлөл',
            },
          ],
        },
        {
          id: 'founded_at',
          kind: 'date',
          label: 'Үүсгэн байгуулагдсан огноо',
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
          id: 'website',
          kind: 'text',
          label: 'Байгууллагын цахим хуудас',
        },
        {
          id: 'management_info',
          kind: 'textarea',
          label: 'Удирдлагын мэдээлэл',
          required: true,
        },
        {
          id: 'employee_count',
          kind: 'text',
          label: 'Байгууллагын үндсэн ажилтны тоо',
        },
        {
          id: 'contact_channels',
          kind: 'text',
          label: 'Захиалга/мэдээллийн холбоос',
        },
      ],
    },
    {
      id: 'services_8_1',
      title: 'Үйлчилгээний чиглэл (Хуулийн 8.1.1)',
      fields: [
        {
          id: 'service_directions',
          kind: 'checkbox_group',
          label: 'Чиглэл',
          required: true,
          options: [
            { value: 'intl_airline', label: 'Олон улсын авиа компани' },
            { value: 'domestic_airline', label: 'Дотоодын авиа компани' },
            { value: 'intl_hotel', label: 'Олон улсын зочид буудлын захиалга' },
            {
              value: 'domestic_hotel',
              label: 'Дотоодын зочид буудлын захиалга',
            },
            { value: 'tour_operator_trips', label: 'Тур оператор компаниудын аялал' },
            { value: 'camp_booking', label: 'Жуулчны баазын захиалга' },
            { value: 'train', label: 'Галт тэрэг' },
            { value: 'bus', label: 'Автобус' },
            { value: 'consulting', label: 'Зөвлөгөө' },
            { value: 'transport', label: 'Тээвэр' },
            { value: 'data_sim', label: 'Дата сим' },
            { value: 'insurance', label: 'Даатгал' },
            { value: 'inn_booking', label: 'Дэн буудлын захиалга' },
            { value: 'guesthouse_booking', label: 'Гэст хаузын захиалга' },
            {
              value: 'local_products',
              label: 'Нутгийн иргэдэд түшиглэсэн бүтээгдэхүүн, үйлчилгээ',
            },
            { value: 'foreign_trade', label: 'Гадаад худалдаа' },
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
          id: 'doc_liability_insurance',
          kind: 'file',
          label: 'Байгууллагын хариуцлагын даатгалын гэрчилгээ/гэрээ',
        },
        { id: 'doc_tax', kind: 'file', label: 'Татвар төлөгчийн тодорхойлолт' },
        {
          id: 'doc_social_insurance',
          kind: 'file',
          label: 'А.А.Н-ийн нийгмийн даатгалын шимтгэл төлөлтийн тодорхойлолт',
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
