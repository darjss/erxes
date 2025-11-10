export const UNIT_SALE_STATUS = {
  available: {
    mn: 'Нээлттэй',
    en: 'Available',
    color: 'hsl(var(--border))',
  },
  reserved: {
    mn: 'Түр хадгалсан',
    en: 'Reserved',
    color: '#F59E0B',
  },
  sold: {
    mn: 'Худалдагдсан',
    en: 'Sold',
    color: '#10B981',
  },
  underFinance: {
    mn: 'Санхүүгийн тооцоо',
    en: 'Under financing',
    color: '#6366F1',
  },
  cancelled: {
    mn: 'Цуцлагдсан',
    en: 'Cancelled',
    color: '#6B7280',
  },
  onHold: {
    mn: 'Түгжсэн',
    en: 'On hold',
    color: '#3B82F6',
  },
};

export const UNIT_LEASE_STATUS = {
  vacant: {
    mn: 'Чөлөөтэй',
    en: 'Vacant',
  },
  reserved: {
    mn: 'Урьдчилсан захиалга',
    en: 'Reserved',
  },
  leased: {
    mn: 'Түрээслэгдсэн',
    en: 'Leased/Occupied',
  },
  leaseExpireSoon: {
    mn: 'Дуусах гэж буй',
    en: 'Lease expire soon',
  },
  leaseRenewal: {
    mn: 'Сунгагдаж буй',
    en: 'Lease renewal',
  },
  underFitout: {
    mn: 'Дотоод тохижилт',
    en: 'Under Fitout',
  },
  cancelled: {
    mn: 'Цуцлагдсан',
    en: 'Cancelled',
  },
  internalUse: {
    mn: 'Дотоод хэрэглээ ',
    en: 'Internal use',
  },
};

export const UNIT_USAGE_TYPE = {
  apartment: {
    mn: 'Орон сууц',
    en: 'Apartment',
  },
  office: {
    mn: 'Оффис',
    en: 'Office',
  },
  serviceArea: {
    mn: 'Үйлчилгээний талбай',
    en: 'Service area',
  },
  parking: {
    mn: 'Авто зогсоол',
    en: 'Parking',
  },
  basement: {
    mn: 'Зоорь',
    en: 'Basement',
  },
  retail: {
    mn: 'Худалдан авах',
    en: 'Retail',
  },
};

export const UNIT_MARKET_TYPE = {
  forSale: {
    mn: 'Худалдаа',
    en: 'Sale',
  },
  forLease: {
    mn: 'Түрээс',
    en: 'Lease',
  },
};

export const UNIT_ROOM_COUNT = {
  studio: {
    mn: 'Студио',
    en: 'Studio',
  },
  oneBedroom: {
    mn: '1 өрөө',
    en: '1 room',
  },
  twoBedrooms: {
    mn: '2 өрөө',
    en: '2 room',
  },
  threeBedrooms: {
    mn: '3 өрөө',
    en: '3 room',
  },
  fourBedrooms: {
    mn: '4 өрөө',
    en: '4 room',
  },
  fiveOrMoreBedrooms: {
    mn: '5-аас дээш өрөө',
    en: '5 room',
  },
};

export const UNIT_ORIENTATION = {
  north: {
    mn: 'Хойд',
    en: 'North',
  },
  south: {
    mn: 'Өмнө',
    en: 'South',
  },
  east: {
    mn: 'Зүүн',
    en: 'East',
  },
  west: {
    mn: 'Баруун',
    en: 'West',
  },
};

export const UNIT_DOCUMENT_TABS = {
  overview: {
    mn: 'Ерөнхий мэдээлэл',
    en: 'Overview',
  },
  document: {
    mn: 'Документ',
    en: 'Document',
  },
  media: {
    mn: 'Медиа',
    en: 'Media',
  },
  contracts: {
    mn: 'Гэрээ',
    en: 'Contracts',
  },
  offers: {
    mn: 'Үнийн санал',
    en: 'Offers',
  },
};

export const UNIT_DOCUMENT_TABS_KEYS = Object.keys(UNIT_DOCUMENT_TABS).reduce(
  (acc, key) => {
    acc[key as keyof typeof UNIT_DOCUMENT_TABS] = key;
    return acc;
  },
  {} as Record<keyof typeof UNIT_DOCUMENT_TABS, string>,
);
