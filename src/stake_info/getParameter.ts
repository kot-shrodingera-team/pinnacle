import { getWorkerParameter } from '@kot-shrodingera-team/germes-utils';

const getParameter = (): number => {
  if (
    getWorkerParameter('fakeParameter') ||
    getWorkerParameter('fakeOpenStake')
  ) {
    const parameter = Number(JSON.parse(worker.ForkObj).param);
    if (Number.isNaN(parameter)) {
      return -6666;
    }
    return parameter;
  }
  if ('points' in window.germesData.selection) {
    return window.germesData.selection.points;
  }
  return -6666;
};

export default getParameter;
