import { log } from '@kot-shrodingera-team/germes-utils';

const setStakeSumm = (sum: number): boolean => {
  log(`Вводим сумму ставки: "${sum}"`, 'orange');
  window.germesInfo.placeSum = sum;
  worker.StakeInfo.Summ = sum;
  return true;
};

export default setStakeSumm;
