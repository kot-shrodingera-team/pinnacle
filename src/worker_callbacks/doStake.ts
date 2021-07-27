import { getWorkerParameter, log } from '@kot-shrodingera-team/germes-utils';
import getStoreState from '../helpers/getStoreState';

const doStake = (): boolean => {
  if (getWorkerParameter('fakeDoStake')) {
    log('[fake] Делаем ставку', 'orange');
    return true;
  }
  const state = getStoreState();
  if (!state) {
    log('Ошибка ставки: Не найдены мета данные аккаунта', 'crimson');
    return false;
  }
  const data = {
    oddsFormat: 'decimal',
    acceptBetterPrices: false,
    class: 'Straight',
    selections: [window.germesData.selection],
    stake: window.germesData.placeSum,
    acceptBetterPrice: false,
  };
  window.germesData.straightResponse = null;
  fetch('https://api.arcadia.pinnacle.com/0.1/bets/straight', {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R',
      'X-Device-UUID': state.User.uuid,
      ...(state.User.token ? { 'X-Session': state.User.token } : {}),
    },
  })
    .then((r) => r.json())
    .then((r) => {
      window.germesData.straightResponse = r;
    });

  window.germesData.loadingStep = 'waitStraight';
  return true;
};

export default doStake;
