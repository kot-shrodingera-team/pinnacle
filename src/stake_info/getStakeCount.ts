import { getWorkerParameter } from '@kot-shrodingera-team/germes-utils';

const getStakeCount = (): number => {
  if (
    getWorkerParameter('fakeStakeCount') ||
    getWorkerParameter('fakeOpenStake')
  ) {
    return 1;
  }
  return window.germesData.rawQuote ? 1 : 0;
};

export default getStakeCount;
