import getStakeInfoValueGenerator, {
  stakeInfoValueReadyGenerator,
} from '@kot-shrodingera-team/germes-generators/stake_info/getStakeInfoValue';
import { StakeInfoValueOptions } from '@kot-shrodingera-team/germes-generators/stake_info/types';
import { log } from '@kot-shrodingera-team/germes-utils';
import getStoreState from '../helpers/getStoreState';

// export const balanceSelector = '';

const balanceOptions: StakeInfoValueOptions = {
  name: 'balance',
  fixedValue: () => window.germesData.balance,
  // valueFromText: {
  //   text: {
  //     // getText: () => '',
  //     selector: balanceSelector,
  //     context: () => document,
  //   },
  //   replaceDataArray: [
  //     {
  //       searchValue: '',
  //       replaceValue: '',
  //     },
  //   ],
  //   removeRegex: /[\s,']/g,
  //   matchRegex: /(\d+(?:\.\d+)?)/,
  //   errorValue: 0,
  // },
  // zeroValues: [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // modifyValue: (value: number, extractType: string) => value,
  // disableLog: false,
};

const getBalance = getStakeInfoValueGenerator(balanceOptions);

export const balanceReady = stakeInfoValueReadyGenerator(balanceOptions);

export const updateBalance = (): void => {
  worker.StakeInfo.Balance = getBalance();
  worker.JSBalanceChange(getBalance());
};

export const refreshBalance = async (): Promise<void> => {
  const state = getStoreState();
  if (!state) {
    log('Не найдены мета данные аккаунта', 'crimson');
    return;
  }
  const hostname = window.location.hostname.replace(/^www\./, '');
  const balanceResponse = await fetch(
    `https://api.arcadia.${hostname}/0.1/wallet/balance`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R',
        'X-Device-UUID': state.User.uuid,
        ...(state.User.token ? { 'X-Session': state.User.token } : {}),
      },
    },
  ).then((r) => r.json());
  if (!('amount' in balanceResponse)) {
    log('Не удалось определить баланс', 'crimson');
    return;
  }
  window.germesData.balance = balanceResponse.amount;
  window.germesData.currency = balanceResponse.currency;
  updateBalance();
};

export default getBalance;
