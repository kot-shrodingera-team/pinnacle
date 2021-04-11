const setStakeSumm = (sum: number): boolean => {
  window.germesInfo.placeSum = sum;
  worker.StakeInfo.Summ = sum;
  return true;
};

export default setStakeSumm;
