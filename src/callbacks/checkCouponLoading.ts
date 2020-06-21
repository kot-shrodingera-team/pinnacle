import { getIsPlacingBet } from '../stakeData';

const checkCouponLoading = (): boolean => {
  const isPlacingBet = getIsPlacingBet();
  if (isPlacingBet) {
    worker.Helper.WriteLine('Ставка еще принимается');
  } else {
    worker.Helper.WriteLine('Принятие ставки закончено');
  }
  return isPlacingBet;
};

export default checkCouponLoading;
