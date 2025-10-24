export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

export const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/[^0-9.-]+/g, ''));
};
