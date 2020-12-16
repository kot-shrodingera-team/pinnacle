import { log } from '@kot-shrodingera-team/config/util';
import { clearDoStakeTime } from '../doStakeTime';
import { clearStakeProcessingHungMessageSend } from './checkCouponLoading';

const doStake = (): boolean => {
  log('Делаем ставку', 'orange');
  const stakeButton = document.querySelector(
    'button[data-test-id="Betslip-ConfirmBetButton"]'
  ) as HTMLElement;
  if (!stakeButton) {
    log('Не найдена кнопка "Сделать ставку"', 'crimson');
    return false;
  }
  stakeButton.click();
  clearDoStakeTime();
  clearStakeProcessingHungMessageSend();
  return true;
};

export default doStake;
