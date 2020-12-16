import { log } from '@kot-shrodingera-team/config/util';
import getBalance, {
  balanceReady,
  updateBalance,
} from '../stake_info/getBalance';
import checkAuth, { authCheckReady } from '../stake_info/checkAuth';
import authorize from './authorize';

const initialize = async (): Promise<void> => {
  if (worker.LoginTry > 3) {
    log('Превышен лимит попыток авторизации', 'crimson');
    return;
  }

  await authCheckReady(15000);
  worker.Islogin = checkAuth();
  worker.JSLogined();
  if (worker.Islogin) {
    log('Есть авторизация', 'green');
    worker.Islogin = true;
    worker.JSLogined();
    const balanceLoaded = await balanceReady();
    if (!balanceLoaded) {
      log(`Баланс не появился (${getBalance()})`, 'crimson');
    } else {
      updateBalance();
    }
    return;
  }
  authorize();
};

export default initialize;
