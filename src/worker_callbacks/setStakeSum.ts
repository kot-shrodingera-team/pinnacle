// import setStakeSumGenerator, {
//   clearStakeSumGenerator,
// } from '@kot-shrodingera-team/germes-generators/worker_callbacks/setStakeSum';
import { getWorkerParameter, log } from '@kot-shrodingera-team/germes-utils';
// import getCurrentSum, { sumInputSelector } from '../stake_info/getCurrentSum';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const preInputCheck = (sum: number): boolean => {
//   return true;
// };

// const setStakeSumOptions = {
//   sumInputSelector,
//   alreadySetCheck: {
//     getCurrentSum,
//     falseOnSumChange: false,
//   },
//   preInputCheck,
//   inputType: 'fireEvent' as 'fireEvent' | 'react' | 'nativeInput',
//   fireEventNames: ['input'],
//   context: () => document,
// };

// const setStakeSum = setStakeSumGenerator(setStakeSumOptions);

// export const clearStakeSum = clearStakeSumGenerator(setStakeSumOptions);

const setStakeSumm = (sum: number): boolean => {
  if (getWorkerParameter('fakeDoStake')) {
    log(`[fake] Вводим сумму ставки: "${sum}"`, 'orange');
    return true;
  }
  log(`Вводим сумму ставки: "${sum}"`, 'orange');
  if (sum > worker.StakeInfo.Balance) {
    log('Ошибка ввода суммы ставки: вводимая сумма больше баланса', 'crimson');
    return false;
  }
  if (sum > worker.StakeInfo.MaxSumm) {
    log(
      'Ошибка ввода суммы ставки: вводимая сумма больше максимальной ставки',
      'crimson',
    );
    return false;
  }
  window.germesData.placeSum = sum;
  worker.StakeInfo.Summ = sum;
  return true;
};

export default setStakeSumm;
