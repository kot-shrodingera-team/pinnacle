// import {
//   balanceReadyGenerator,
//   getBalanceGenerator,
// } from '@kot-shrodingera-team/germes-generators/stake_info/getBalance';

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

export const refreshBalance = async (): Promise<void> => {
  const state = getStoreState();
  if (!state) {
    log('Не найдены мета данные аккаунта', 'crimson');
    return;
  }
  const balanceResponse = await fetch(
    'https://api.arcadia.pinnacle.com/0.1/wallet/balance',
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R',
        'X-Device-UUID': state.User.uuid,
        ...(state.User.token ? { 'X-Session': state.User.token } : {}),
      },
    }
  ).then((r) => r.json());
  if (!('amount' in balanceResponse)) {
    log('Не удалось определить баланс', 'crimson');
    return;
  }
  worker.StakeInfo.Balance = balanceResponse.amount;
  worker.JSBalanceChange(worker.StakeInfo.Balance);
};

const getBalance = (): number => {
  return worker.StakeInfo.Balance;
};

export const balanceReady = async (): Promise<boolean> => {
  return true;
};

// export const balanceReady = balanceReadyGenerator({
//   balanceSelector: '[data-test-id="QuickCashier-BankRoll"]',
//   // balanceRegex: /(\d+(?:\.\d+)?)/,
//   // replaceDataArray: [
//   //   {
//   //     searchValue: '',
//   //     replaceValue: '',
//   //   },
//   // ],
//   // removeRegex: /[\s,']/g,
// });

// const getBalance = getBalanceGenerator({
//   balanceSelector: '[data-test-id="QuickCashier-BankRoll"]',
//   // balanceRegex: /(\d+(?:\.\d+)?)/,
//   // replaceDataArray: [
//   //   {
//   //     searchValue: '',
//   //     replaceValue: '',
//   //   },
//   // ],
//   // removeRegex: /[\s,']/g,
// });

export const updateBalance = (): void => {
  worker.JSBalanceChange(getBalance());
};

export default getBalance;
