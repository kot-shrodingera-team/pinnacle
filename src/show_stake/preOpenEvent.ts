import {
  checkBookerHost,
  checkCurrency,
  log,
} from '@kot-shrodingera-team/germes-utils';
import {
  NewUrlError,
  JsFailError,
} from '@kot-shrodingera-team/germes-utils/errors';
import getSiteCurrency from '../helpers/getSiteCurrency';
import checkAuth, { authStateReady } from '../stake_info/checkAuth';
import {
  balanceReady,
  refreshBalance,
  updateBalance,
} from '../stake_info/getBalance';

const preOpenEvent = async (): Promise<void> => {
  if (!checkBookerHost()) {
    log('Открыта не страница конторы (или зеркала)', 'crimson');
    window.location.href = new URL(worker.BookmakerMainUrl).href;
    throw new NewUrlError('Открываем страницу БК');
  }

  await authStateReady();
  worker.Islogin = checkAuth();
  worker.JSLogined();
  if (!worker.Islogin) {
    throw new JsFailError('Нет авторизации');
  }
  log('Есть авторизация', 'steelblue');
  await balanceReady();
  await refreshBalance();
  updateBalance();

  const siteCurrency = getSiteCurrency();
  checkCurrency(siteCurrency);
};

export default preOpenEvent;
