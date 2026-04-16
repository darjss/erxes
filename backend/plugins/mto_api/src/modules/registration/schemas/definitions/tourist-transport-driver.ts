import { RegistrationFormDefinition } from '@/registration/@types/registrationForm';
import { SCHEMA_VERSION_V1 } from '../constants';

export const touristTransportDriverForm: RegistrationFormDefinition = {
  membershipTypeId: 'tourist_transport_driver',
  schemaVersion: SCHEMA_VERSION_V1,
  title: 'Жуулчин тээврийн жолооч',
  description: 'Гишүүний татвар: 300,000 ₮',
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
        {
          id: 'contact_phone',
          kind: 'text',
          label: 'Утасны дугаар',
          required: true,
        },
        {
          id: 'blood_type',
          kind: 'select',
          label: 'Цусны бүлэг',
          required: true,
          options: [
            { value: 'o', label: 'I бүлэг (O)' },
            { value: 'a', label: 'II бүлэг (A)' },
            { value: 'b', label: 'III бүлэг (B)' },
            { value: 'ab', label: 'IV бүлэг (AB)' },
          ],
        },
      ],
    },
    {
      id: 'vehicle',
      title: 'Тээврийн хэрэгслийн мэдээлэл',
      fields: [
        {
          id: 'vehicle_make_type',
          kind: 'select',
          label: 'Авто машины марк / төрөл',
          options: [
            { value: 'suv', label: 'Жийп (Ланд/Лексус/Прадо гэх мэт)' },
            { value: 'van', label: 'Пургон' },
            { value: 'delica', label: 'Делика' },
            { value: 'starex', label: 'Старекс' },
            { value: 'hiace', label: 'Тоёото Хайс' },
            { value: 'alphard', label: 'Альфард' },
            { value: 'other', label: 'Бусад' },
          ],
        },
        {
          id: 'vehicle_year',
          kind: 'text',
          label: 'Үйлдвэрлэсэн он',
        },
        {
          id: 'steering_position',
          kind: 'select',
          label: 'Хүрдний байрлал',
          options: [
            { value: 'right', label: 'Баруун (Right-hand drive)' },
            { value: 'left', label: 'Зүүн (Left-hand drive)' },
          ],
        },
      ],
    },
    {
      id: 'experience',
      title: 'Мэргэжлийн туршлага',
      fields: [
        {
          id: 'tourist_driving_years',
          kind: 'select',
          label: 'Жуулчин тээвэрт явсан жил',
          options: [
            { value: '1_3', label: '1-3 жил' },
            { value: '3_6', label: '3-6 жил' },
            { value: '6_9', label: '6-9 жил' },
            { value: '9_12', label: '9-12 жил' },
            { value: '12_plus', label: '12-оос дээш' },
          ],
        },
        {
          id: 'tour_operator_names',
          kind: 'textarea',
          label: 'Харьяалагддаг тур оператор компанийн нэрс',
        },
      ],
    },
    {
      id: 'documents',
      title: 'Байршуулах баримт бичгүүд',
      fields: [
        { id: 'doc_photo', kind: 'file', label: 'Зураг (профайл зураг)' },
        {
          id: 'doc_training_certificate',
          kind: 'file',
          label: 'Сургалтын сертификат',
        },
        {
          id: 'doc_vehicle_registration',
          kind: 'file',
          label: 'Тээврийн хэрэгслийн гэрчилгээ',
        },
        {
          id: 'doc_regular_license',
          kind: 'file',
          label: 'Энгийн жолооны үнэмлэх',
        },
        {
          id: 'doc_professional_license',
          kind: 'file',
          label: 'Мэргэшсэн жолооны үнэмлэх',
        },
        {
          id: 'doc_operator_statement',
          kind: 'file',
          label: 'Тур оператор компанийн тодорхойлолт',
        },
        {
          id: 'doc_membership_fee',
          kind: 'file',
          label: 'Гишүүний татвар төлсөн баримт',
        },
      ],
    },
  ],
};
