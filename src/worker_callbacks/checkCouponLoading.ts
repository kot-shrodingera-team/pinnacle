import { log } from '@kot-shrodingera-team/config/util';
import { getDoStakeTime } from '../doStakeTime';
import getBalance from '../stake_info/getBalance';

const timeString = (time: Date): string => {
  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');
  const miliseconds = String(time.getMilliseconds()).padStart(3, '0');
  return `${hours}:${minutes}:${seconds}.${miliseconds}`;
};

const stakeInfoString = (): string => {
  return (
    `Событие: ${worker.TeamOne} vs ${worker.TeamTwo}\n` +
    `Ставка: ${worker.BetName}\n` +
    `Сумма: ${worker.StakeInfo.Summ}\n` +
    `Коэффициент: ${worker.StakeInfo.Coef}`
  );
};

const round = (value: number, precision = 2): number =>
  Number(value.toFixed(precision));

const checkCouponLoading = (): boolean => {
  const now = new Date();
  const doStakeTime = getDoStakeTime();
  const timePassedSinceDoStake = now.getTime() - doStakeTime.getTime();
  const timeout = 60000;
  if (timePassedSinceDoStake > timeout) {
    log(`now = ${now.getTime()}`);
    log(`doStakeTime = ${doStakeTime.getTime()}`);
    log(`timePassedSinceDoStake = ${timePassedSinceDoStake}`);
    log(`timeout = ${timeout}`);
    log(
      `Текущее время: ${timeString(now)}, время ставки: ${timeString(
        doStakeTime
      )}`
    );
    const message =
      `В Pinnacle очень долгое принятие ставки\n` +
      `Бот засчитает ставку как НЕ принятую\n` +
      `${stakeInfoString()}\n` +
      `Пожалуйста, проверьте самостоятельно. Если всё плохо - пишите в ТП`;
    worker.Helper.SendInformedMessage(message);
    log('Слишком долгая обработка, считаем ставку непринятой', 'crimson');
    return false;
  }
  const loader = document.querySelector('.style_processing__5bJrD');
  if (loader) {
    log('Обработка ставки (есть иконка обработки)', 'tan');
    if (localStorage.getItem('loaderAppeared') === '0') {
      localStorage.setItem('loaderAppeared', '1');
    }
    return true;
  }
  const betCardMessage = document.querySelector(
    '[data-test-id="Betslip-CardMessage"]'
  );
  if (betCardMessage) {
    const betCardMessageStyle = betCardMessage.getAttribute('style');
    if (betCardMessageStyle.includes('global-messages-warning')) {
      log('Обработка ставки завершена (ошибка ставки)', 'orange');
      return false;
    }
    if (betCardMessageStyle.includes('betslip-cardMessage-accepted-color')) {
      log('Обработка ставки завершена (ставка принята)', 'orange');
      return false;
    }
    log('Обработка ставки (непонятный результат)', 'tan');
  }
  if (
    localStorage.getItem('loaderAppeared') === '1' &&
    localStorage.getItem('loaderDisappearedTime') === ''
  ) {
    log('Пропала иконка обработки', 'steelblue');
    localStorage.setItem('loaderDisappearedTime', String(now.getTime()));
  }
  if (localStorage.getItem('loaderDisappearedTime') !== '') {
    const diff = round(worker.StakeInfo.Balance - getBalance());
    log(`Баланс был: ${worker.StakeInfo.Balance}`, 'steelblue');
    log(`Текущий баланс: ${getBalance()}`, 'steelblue');
    log(`Ставилось: ${worker.StakeInfo.Summ}`, 'steelblue');
    log(`Разница: ${diff}`, 'steelblue');
    if (diff === worker.StakeInfo.Summ) {
      log(
        'Баланс уменьшился на сумму ставки. Считаем ставку принятой',
        'orange'
      );
      const message =
        `В Pinnacle пропал купон во время обработки ставки\n` +
        `Баланс уменьшился на сумму ставки\n` +
        `Считаем ставку принятой\n` +
        `${stakeInfoString()}\n` +
        `Пожалуйста, проверьте самостоятельно. Если всё плохо - пишите в ТП`;
      worker.Helper.SendInformedMessage(message);
      localStorage.setItem('betPlaced', '1');
      return false;
    }
    log('Баланс не уменьшился на сумму ставки', 'steelblue');
    const loaderDisappearedTime = new Date(
      Number(localStorage.getItem('loaderDisappearedTime'))
    );
    if (now.getTime() - loaderDisappearedTime.getTime() > 3000) {
      log('Прошло больше 3 секунды после исчезновения лоадера', 'steelblue');
      const message =
        `В Pinnacle пропал купон во время обработки ставки\n` +
        `Прошло больше 3 секунд\n` +
        `Баланс не уменьшился на сумму ставки\n` +
        `Считаем ставку НЕ принятой\n` +
        `${stakeInfoString()}\n` +
        `Пожалуйста, проверьте самостоятельно. Если всё плохо - пишите в ТП`;
      worker.Helper.SendInformedMessage(message);
      return false;
    }
  }
  log('Обработка ставки (нет иконки обработки)', 'tan');
  return true;
};

export default checkCouponLoading;
