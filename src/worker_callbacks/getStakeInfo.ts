import { log } from '@kot-shrodingera-team/config/util';
import checkAuth from '../stake_info/checkAuth';
import getStakeCount from '../stake_info/getStakeCount';
import getBalance from '../stake_info/getBalance';
import checkStakeEnabled from '../stake_info/checkStakeEnabled';
import getCoefficient from '../stake_info/getCoefficient';
import getParameter from '../stake_info/getParameter';
import getMinimumStake from '../stake_info/getMinimumStake';
import getMaximumStake from '../stake_info/getMaximumStake';
import getCurrentSum from '../stake_info/getCurrentSum';

const getStakeInfo = (): void => {
  worker.StakeInfo.Auth = checkAuth();
  worker.StakeInfo.StakeCount = getStakeCount();
  worker.StakeInfo.Balance = getBalance();
  worker.StakeInfo.MinSumm = getMinimumStake();
  worker.StakeInfo.MaxSumm = getMaximumStake();
  worker.StakeInfo.Summ = getCurrentSum();
  worker.StakeInfo.IsEnebled = checkStakeEnabled();
  worker.StakeInfo.Coef = getCoefficient();
  worker.StakeInfo.Parametr = getParameter();
  const message =
    `Информация о ставке:\n` +
    `Авторизация: ${worker.StakeInfo.Auth ? 'Есть' : 'Нет'}\n` +
    `Баланс: ${worker.StakeInfo.Balance}\n` +
    `Ставок в купоне: ${worker.StakeInfo.StakeCount}\n` +
    `Ставка доступна:  ${worker.StakeInfo.IsEnebled ? 'Да' : 'Нет'}\n` +
    `Лимиты: ${worker.StakeInfo.MinSumm} - ${worker.StakeInfo.MaxSumm}\n` +
    `Текущая сумма в купоне: ${worker.StakeInfo.Summ}\n` +
    `Коэффициент: ${worker.StakeInfo.Coef}\n` +
    `Параметр: ${worker.StakeInfo.Parametr}`;
  log(message, 'lightgrey');
};

export default getStakeInfo;
