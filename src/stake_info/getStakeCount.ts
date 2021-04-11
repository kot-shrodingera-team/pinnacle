const getStakeCount = (): number => {
  return window.germesInfo.rawQuote ? 1 : 0;
};

export default getStakeCount;
