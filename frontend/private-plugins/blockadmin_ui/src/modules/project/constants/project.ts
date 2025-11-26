export const PROJECT_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'office', label: 'Office' },
  { value: 'serviceArea', label: 'Service Area' },
  { value: 'parking', label: 'Parking' },
  { value: 'basement', label: 'Basement' },
  { value: 'residential', label: 'Residential' },
  { value: 'retail', label: 'Retail' },
];

export const PROJECT_AMENITIES = [
  'Swimming pool',
  'Gym',
  'Parking',
  '24/7 Security',
  'High-speed internet',
  'Backup power',
  'Spa',
  'Playground',
  'Conference room',
  'Rooftop garden',
  'Bicycle storage',
  'Pet-friendly areas',
];

export const PROJECT_TABS = {
  GENERAL: 'general',
  PRICING: 'pricing',
  BUILDINGS: 'buildings',
  ZONES: 'zones',
  UNIT_TYPES: 'unit types',
  UNITS: 'units',
  AMENITIES: 'amenities',
  MEMBERS: 'members',
  SEO: 'SEO',
  MEDIA: 'media',
  POLICIES: 'policies',
  DOCUMENTS: 'documents',
  INSIDER: 'insider',
  CONTACT: 'contact',
  TARGET: 'target',
  SPECIFICATIONS: 'specifications',
};

export const BLOCK_PROJECT_STATUS = {
  planned: {
    variant: 'warning',
    text: 'Төлөвлөсөн',
  },
  on_going: {
    variant: 'info',
    text: 'Хэрэгжиж байгаа',
  },
  on_sale: {
    variant: 'success',
    text: 'Худалдан авах боломжтой',
  },
  completed: {
    variant: 'secondary',
    text: 'Дууссан',
  },
};

export const PUBLISH_STATUS = {
  true: {
    color: 'bg-success',
    text: 'Нийтлэгдсэн',
  },
  false: {
    color: 'bg-destructive',
    text: 'Нийтлээгүй',
  },
};

export const PROJECT_STATUS_OPTIONS = [
  { value: 'planned', label: 'Planned' },
  { value: 'on_going', label: 'On going' },
  { value: 'on_sale', label: 'On sale' },
  { value: 'completed', label: 'Completed' },
];
