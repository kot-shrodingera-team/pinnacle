const getSiteCurrency = (): string => {
  const { currency } = window.germesData;
  if (currency === 'EUR') {
    return 'EUR';
  }
  return 'Unknown';
};

export default getSiteCurrency;
