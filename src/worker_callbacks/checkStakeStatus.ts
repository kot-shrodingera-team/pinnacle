import { getWorkerParameter, log } from '@kot-shrodingera-team/germes-utils';
import { refreshBalance } from '../stake_info/getBalance';

const checkStakeStatus = (): boolean => {
  if (getWorkerParameter('fakeDoStake')) {
    log('[fake] Ставка принята', 'green');
    return true;
  }
  if (!window.germesData.betPlaced) {
    log('Ставка не принята', 'red');
    return false;
  }
  log('Ставка принята', 'green');

  refreshBalance();

  return true;
};

export default checkStakeStatus;
