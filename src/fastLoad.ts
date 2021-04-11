import { log } from '@kot-shrodingera-team/germes-utils';
import { version } from '../package.json';
import showStake from './show_stake';

const fastLoad = async (): Promise<void> => {
  log(`Быстрая загрузка (${version})`, 'steelblue');
  window.germesInfo = {
    selection: null,
    rawQuote: null,
    maximumStake: 0,
    minimumStake: 0,
    price: 0,
    placeSum: 0,
    loadingStep: null,
    straightResponse: null,
    pendingResponse: null,
    requestId: null,
    pendingDelay: null,
    betPlaced: null,
  };
  await showStake();
};

export default fastLoad;
