import '@kot-shrodingera-team/config/workerCheck';
import './globalDefines/request';
import './requestSubscribes';
import { log } from '@kot-shrodingera-team/config/util';
import getStakeInfo from './worker_callbacks/getStakeInfo';
import setStakeSumm from './worker_callbacks/setStakeSum';
import doStake from './worker_callbacks/doStake';
import checkCouponLoading from './worker_callbacks/checkCouponLoading';
import checkStakeStatus from './worker_callbacks/checkStakeStatus';
import showStake from './show_stake';
import afterSuccesfulStake from './worker_callbacks/afterSuccesfulStake';
import initialize from './initialization';
import { setMinimumStake } from './stake_info/getMinimumStake';

(async (): Promise<void> => {
  log('Загрузка страницы', 'steelblue');
  if (!worker.IsShowStake) {
    initialize();
  } else {
    showStake();
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
  log('Быстрая загрузка', 'steelblue');
  setMinimumStake(0);
  await showStake();
};

worker.SetFastCallback(fastLoad);
