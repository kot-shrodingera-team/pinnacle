import { log } from '@kot-shrodingera-team/config/util';
import { updateBalance } from '../stake_info/getBalance';

const checkStakeStatus = (): boolean => {
  const betCardMessage = document.querySelector(
    '[data-test-id="Betslip-CardMessage"]'
  );
  if (!betCardMessage) {
    log('Нет результата ставки', 'crimson');
    return false;
  }
  const betCardMessageStyle = betCardMessage.getAttribute('style');
  const betCardMessageTitleElement = betCardMessage.querySelector(
    '[data-test-id="BetSlip-CardMessage-Title"]'
  ) as HTMLElement;
  const betCardMessageBodyElement = betCardMessage.querySelector(
    '[data-test-id="BetSlip-CardMessage-Body"]'
  ) as HTMLElement;
  const betCardMessageSpanElement = document.querySelector(
    '[data-test-id="Betslip-CardMessage"] > span'
  ) as HTMLElement;
  if (betCardMessageStyle.includes('global-messages-warning')) {
    if (betCardMessageTitleElement && betCardMessageBodyElement) {
      const betCardMessageTitle = betCardMessageTitleElement.textContent.trim();
      const betCardMessageBody = betCardMessageBodyElement.textContent.trim();
      log(
        `Ошибка ставки\nЗаголовок: "${betCardMessageTitle}"\nТекст: "${betCardMessageBody}"`,
        'tomato'
      );
    }
    if (betCardMessageSpanElement) {
      const betCardMessageSpan = betCardMessageSpanElement.textContent.trim();
      log(`Ошибка ставки: "${betCardMessageSpan}"`, 'tomato');
    }
    log(`Непонятная ошибка ставки`, 'crimson');
    return false;
  }
  if (betCardMessageStyle.includes('betslip-cardMessage-accepted-color')) {
    log('Ставка принята', 'green');
    updateBalance();
    return true;
  }
  log('Непонятный результат ставки. Считаем ставку непринятой', 'crimson');
  return false;
};

export default checkStakeStatus;
