import { log } from '@kot-shrodingera-team/config/util';
import { clearDoStakeTime } from '../doStakeTime';

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
  localStorage.setItem('loaderAppeared', '0');
  localStorage.setItem('loaderDisappearedTime', '');
  localStorage.setItem('betPlaced', '0');
  return true;
};

export default doStake;
