import './workerCheck';
import './globalDefines/request';
import './requestSubscribes';
import { pipeHwlToConsole } from '@kot-shrodingera-team/config/util';
import authorize from './authorize';
import getStakeInfo from './callbacks/getStakeInfo';
import setStakeSumm from './callbacks/setStakeSum';
import doStake from './callbacks/doStake';
import checkCouponLoading from './callbacks/checkCouponLoading';
import checkStakeStatus from './callbacks/checkStakeStatus';
import showStake from './showStake';
import afterSuccesfulStake from './callbacks/afterSuccesfulStake';

pipeHwlToConsole();

(async (): Promise<void> => {
  console.log('Begin');
  if (worker.IsShowStake) {
    worker.Helper.WriteLine('Открываем вилку');
    await showStake();
  } else {
    await authorize();
  }
})();

worker.SetCallBacks(
  console.log,
  getStakeInfo,
  setStakeSumm,
  doStake,
  checkCouponLoading,
  checkStakeStatus,
  afterSuccesfulStake
);

const fastLoad = async (): Promise<void> => {
  worker.Helper.WriteLine('Быстрая загрузка');
  await showStake();
};

worker.SetFastCallback(fastLoad);
