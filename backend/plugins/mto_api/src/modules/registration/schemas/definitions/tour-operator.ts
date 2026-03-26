import { RegistrationFormDefinition } from '@/registration/@types/registrationForm';
import { MONGOLIA_PROVINCE_OPTIONS, SCHEMA_VERSION_V1 } from '../constants';

export const tourOperatorForm: RegistrationFormDefinition = {
  membershipTypeId: 'tour_operator',
  schemaVersion: SCHEMA_VERSION_V1,
  title: 'Тур оператор компани',
  description: 'Гишүүний татвар: 1,200,000 ₮ / жил. Гүйлгээний утга: Байгууллагын нэр · Регистрийн дугаар · Утасны дугаар',
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
            { value: 'foundation', label: 'Сан' },
            { value: 'cooperative', label: 'Хоршоо' },
            { value: 'religious', label: 'Шашны байгууллага' },
            { value: 'government', label: 'Төрийн байгууллага' },
            { value: 'state_industry', label: 'Улсын төсөвт үйлдвэрийн газар' },
            { value: 'commercial_industry', label: 'Аж ахуйн тооцоот үйлдвэрийн газар' },
            {
              value: 'natural_resource_coop',
              label: 'Байгалийн нөөцийн менежментийн нөхөрлөл',
            },
          ],
        },
        {
          id: 'founded_at',
          kind: 'date',
          label: 'Үүсгэн байгуулагдсан огноо',
          required: true,
        },
        {
          id: 'has_foreign_investment',
          kind: 'boolean',
          label: 'Гадны хөрөнгө оруулалттай эсэх',
          required: true,
        },
        {
          id: 'shareholder_count',
          kind: 'text',
          label: 'Хувь эзэмшигчийн тоо',
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
      ],
    },
    {
      id: 'law_12_activity',
      title: 'Байгууллагын үйл ажиллагааны чиглэл (Аялал жуулчлалын тухай хуулийн 12-р зүйл)',
      fields: [
        {
          id: 'activity_directions',
          kind: 'checkbox_group',
          label: 'Чиглэл',
          required: true,
          options: [
            { value: '12.1.1', label: '12.1.1 — Гадагш аялал' },
            { value: '12.1.2', label: '12.1.2 — Дотогш аялал' },
            { value: '12.1.3', label: '12.1.3 — Олон улсын хосолсон аялал' },
            { value: '12.1.4', label: '12.1.4 — Дотоодын аялал' },
          ],
        },
      ],
    },
    {
      id: 'product_types',
      title: 'Бүтээгдэхүүний төрөл (Хуулийн 12.2.2)',
      fields: [
        {
          id: 'product_types',
          kind: 'checkbox_group',
          label: 'Төрөл',
          options: [
            { value: 'leisure', label: 'Амралт зугаалгын' },
            { value: 'adventure', label: 'Адал явдалт' },
            { value: 'cultural', label: 'Соёлын' },
            { value: 'eco', label: 'Эко' },
            { value: 'wellness', label: 'Эрүүл мэндийн' },
            { value: 'business', label: 'Бизнесийн' },
            { value: 'religious_ceremony', label: 'Шашны зан үйлийн' },
            { value: 'sports', label: 'Спортын' },
            { value: 'food', label: 'Хоолны' },
            { value: 'education', label: 'Боловсролын' },
            { value: 'border', label: 'Хил орчмын' },
            { value: 'special_needs', label: 'Тусгай хэрэгцээт' },
            { value: 'volunteer', label: 'Сайн дурын' },
            { value: 'special_interest', label: 'Тусгай сонирхлын' },
          ],
        },
      ],
    },
    {
      id: 'provinces',
      title: 'Аялал зохион байгуулдаг аймгууд',
      fields: [
        {
          id: 'provinces',
          kind: 'multiselect',
          label: 'Аймаг / Улаанбаатар',
          options: MONGOLIA_PROVINCE_OPTIONS,
        },
      ],
    },
    {
      id: 'documents',
      title: 'Байршуулах баримт бичгүүд',
      fields: [
        {
          id: 'doc_registration_certificate',
          kind: 'file',
          label: 'Улсын бүртгэлийн гэрчилгээний хуулбар',
        },
        {
          id: 'doc_logo',
          kind: 'file',
          label: 'Байгууллагын лого',
        },
        {
          id: 'doc_diploma',
          kind: 'file',
          label: 'АЖ-ын мэргэжлийн ажилтны дипломын хуулбар',
        },
        {
          id: 'doc_driver_license',
          kind: 'file',
          label: 'Жуулчны мэргэшсэн жолоочийн үнэмлэхний хуулбар',
        },
        {
          id: 'doc_tax_certificate',
          kind: 'file',
          label: 'Татвар төлөгчийн тодорхойлолт',
        },
        {
          id: 'doc_social_insurance',
          kind: 'file',
          label: 'А.А.Н-ийн НДШимтгэл төлөлтийн тодорхойлолт',
        },
        {
          id: 'doc_liability_insurance',
          kind: 'file',
          label: 'Байгууллагын хариуцлагын даатгалын гэрчилгээ/гэрээ',
        },
        {
          id: 'doc_membership_request',
          kind: 'file',
          label: 'АЖМХ-д гишүүнээр элсэх хүсэлт (албан бичгээр)',
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
          id: 'contact_channels',
          kind: 'text',
          label: 'Захиалга/мэдээллийн холбоос',
        },
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
