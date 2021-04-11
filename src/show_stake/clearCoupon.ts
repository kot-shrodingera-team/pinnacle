const clearCoupon = async (): Promise<boolean> => {
  window.germesInfo.rawQuote = null;
  return true;
};

export default clearCoupon;
