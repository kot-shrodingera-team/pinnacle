import { setReactInputValue } from '@kot-shrodingera-team/config/reactUtils';
import { log } from '@kot-shrodingera-team/config/util';

const setStakeSumm = (sum: number): boolean => {
  log(`Вводим сумму ставки: ${sum}`, 'orange');
  const inputElement = document.querySelector(
    '[data-test-id="Betslip-StakeWinInput"] input'
  );
  if (!inputElement) {
    log('Поле ввода ставки не найдено', 'crimson');
    return false;
  }
  setReactInputValue(inputElement, sum);
  worker.StakeInfo.Summ = sum;
  return true;
};

export default setStakeSumm;
