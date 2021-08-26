import {
  getWorkerParameter,
  log,
  timeString,
} from '@kot-shrodingera-team/germes-utils';

const doStake = (): boolean => {
  if (getWorkerParameter('fakeDoStake')) {
    log('[fake] Делаем ставку', 'orange');
    return true;
  }

  window.germesData.doStakeTime = new Date();
  log(
    `Время ставки: ${timeString(window.germesData.doStakeTime)}`,
    'steelblue',
  );
  window.germesData.stopUpdateManualData = true;
  window.germesData.stopUpdateQuote = true;
  window.germesData.betProcessingStep = 'beforeStart';
  return true;
};

export default doStake;
