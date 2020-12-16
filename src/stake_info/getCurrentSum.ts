import { log } from '@kot-shrodingera-team/config/util';

const getCurrentSum = (): number => {
  const sumInput = document.querySelector(
    '[data-test-id="Betslip-StakeWinInput"] input'
  ) as HTMLInputElement;
  if (!sumInput) {
    log('Не найдено поле ввода суммы ставки', 'crimson');
    return 0;
  }
  const sumText = sumInput.value;
  const sum = Number(sumText);
  if (Number.isNaN(sum)) {
    log(`Непонятный формат текущей суммы ставки: "${sumText}"`, 'crimson');
    return 0;
  }
  return sum;
};

export default getCurrentSum;
