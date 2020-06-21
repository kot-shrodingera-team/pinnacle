import checkLogin from '../getInfo/checkLogin';
import getStakeCount from '../getInfo/getStakeCount';
import checkStakeEnabled from '../getInfo/checkStakeEnabled';
import getCoefficientFromCoupon from '../getInfo/getCoefficientFromCoupon';
import getBalance from '../getInfo/getBalance';
import getMinimumStake from '../getInfo/getMinimumStake';
import getMaximumStake from '../getInfo/getMaximumStake';
import getSumFromCoupon from '../getInfo/getSumFromCoupon';
import getParameterFromCoupon from '../getInfo/getParameterFromCoupon';
import showStake from '../showStake';

const getStakeInfo = (): string => {
  worker.StakeInfo.Auth = checkLogin();
  worker.StakeInfo.StakeCount = getStakeCount();
  worker.StakeInfo.IsEnebled = checkStakeEnabled();
  worker.StakeInfo.Coef = getCoefficientFromCoupon();
  worker.StakeInfo.Balance = getBalance();
  worker.StakeInfo.MinSumm = getMinimumStake();
  worker.StakeInfo.MaxSumm = getMaximumStake();
  worker.StakeInfo.Summ = getSumFromCoupon();
  worker.StakeInfo.Parametr = getParameterFromCoupon();
  if (getStakeCount() !== 1) {
    showStake();
  }
  return JSON.stringify(worker.StakeInfo);
};

export default getStakeInfo;
