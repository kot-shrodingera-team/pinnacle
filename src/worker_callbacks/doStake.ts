import { log } from '@kot-shrodingera-team/germes-utils';
import { getReactInstance } from '@kot-shrodingera-team/germes-utils/reactUtils';

const getStoreState = () => {
  const account = document.querySelector('[data-gtm-id="super_nav_account"]');
  if (!account) {
    return null;
  }
  return (getReactInstance(
    account
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as any).return.return.return.memoizedProps.value.store.getState();
};

const doStake = (): boolean => {
  const state = getStoreState();
  if (!state) {
    log('Ошибка ставки: Не найдены мета данные аккаунта', 'crimson');
    return false;
  }
  const data = {
    oddsFormat: 'decimal',
    acceptBetterPrices: false,
    class: 'Straight',
    selections: [window.germesInfo.selection],
    stake: window.germesInfo.placeSum,
    acceptBetterPrice: false,
  };
  window.germesInfo.straightResponse = null;
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
      window.germesInfo.straightResponse = r;
    });

  window.germesInfo.loadingStep = 'waitStraight';
  return true;
};

export default doStake;
