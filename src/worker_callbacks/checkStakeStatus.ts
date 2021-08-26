// import checkStakeStatusGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/checkStakeStatus';
import { getWorkerParameter, log } from '@kot-shrodingera-team/germes-utils';
import { updateBalance } from '../stake_info/getBalance';

// const checkStakeStatus = checkStakeStatusGenerator({
//   updateBalance,
// });

const checkStakeStatus = (): boolean => {
  if (getWorkerParameter('fakeDoStake')) {
    log('[fake] Ставка принята', 'green');
    return true;
  }
  if (window.germesData.betProcessingStep === 'success') {
    log('Ставка принята', 'green');
    updateBalance();
    return true;
  }
  log('Ставка не принята', 'red');
  window.germesData.stopUpdateManualData = false;
  window.germesData.stopUpdateQuote = false;
  return false;
};

export default checkStakeStatus;
