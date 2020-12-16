import { log } from '@kot-shrodingera-team/config/util';
import { getDoStakeTime } from '../doStakeTime';

let stakeProcessingHungMessageSend = false;
export const clearStakeProcessingHungMessageSend = (): void => {
  stakeProcessingHungMessageSend = false;
};

const checkCouponLoading = (): boolean => {
  const timePassedSinceDoStake =
    new Date().getTime() - getDoStakeTime().getTime();
  if (!stakeProcessingHungMessageSend && timePassedSinceDoStake > 60000) {
    worker.TakeScreenShot(false);
    const message =
      `В Pinnacle очень долгое принятие ставки (более минуты). Возможно зависание\n` +
      `Событие: ${worker.TeamOne} - ${worker.TeamTwo}\n` +
      `Ставка: ${worker.BetName}\n` +
      `Сумма: ${worker.StakeInfo.Summ}\n` +
      `Коэффициент: ${worker.StakeInfo.Coef}\n`;
    worker.Helper.SendInformedMessage(message);
    worker.Helper.WriteLine('Очень долгое принятие ставки. Возможно зависание');
    stakeProcessingHungMessageSend = true;
  }
  const loader = document.querySelector('.style_loading__3V5m8');
  if (loader) {
    log('Обработка ставки (есть иконка обработки)', 'tan');
    return true;
  }
  const betCardMessage = document.querySelector(
    '[data-test-id="Betslip-CardMessage"]'
  );
  if (betCardMessage) {
    const betCardMessageStyle = betCardMessage.getAttribute('style');
    if (betCardMessageStyle.includes('global-messages-warning')) {
      log('Обработка ставки завершена (ошибка ставки)', 'tan');
      return false;
    }
    if (betCardMessageStyle.includes('betslip-cardMessage-accepted-color')) {
      log('Обработка ставки завершена (ставка принята)', 'tan');
      return false;
    }
    if (betCardMessage) {
      log('Обработка ставки завершена (непонятный результат)', 'tan');
      return false;
    }
  }
  log('Обработка ставки (нет иконки обработки)', 'tan');
  return true;
};

export default checkCouponLoading;
