export const CONTRACT_PARTY_TYPE = {
  CUSTOMER: 'customer',
  COMPANY: 'company',
};

export const CONTRACT_TYPE = {
  PRE_ORDER: 'reservation', // Урьдчилан Захиалгын гэрээ
  APARTMENT_PRE_ORDER: 'pre-sale', // Захиалгын гэрээ (орон сууц захиалгын гэрээ)
  HIRE_PURCHASE: 'hire-purchase', // Хувь лизинг (зээлээр хэсэгчилсэн төлбөр)
  LOAN_PRE_ORDER: 'loan-reservation', // Зээлээр захиалан бариулах гэрээ
  INTEREST_FREE_HIRE: 'interest-free-hire', // Хувь Лизинг (хүүгүй)
  BARTER: 'barter', // Арилжааны гэрээ (Бартер буюу мөнгөн бус төлбөр)
  BANK_HOUSING_LOAN: 'bank-housing-loan', // Банкны орон сууцны зээл
  BANK_MORTGAGE: 'bank-mortgage', // Банкны моргейж зээл (6%, 8% гэх мэт)
  SALE: 'sale', // Худалдах, худалдан авах гэрээ
  SALE_BARTER: 'sale-barter', // Худалдах, худалдан авах гэрээ (бартер, мөнгөн бус төлбөр)
};

export const CONTRACT_STATUS = {
  DRAFT: 'draft',
  SIGNED: 'signed',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
};
