import { awaiter, log } from '@kot-shrodingera-team/config/util';
import getStakeCount from '../stake_info/getStakeCount';
// import getMaximumStake from '../stake_info/getMaximumStake';

const clearCoupon = async (): Promise<boolean> => {
  const stakeCount = getStakeCount();
  if (stakeCount !== 0) {
    log(`Купон не пуст (ставок: ${stakeCount}). Очищаем`, 'orange');
    // await sleep(1000);
    if (stakeCount === 1) {
      const clearCouponButton = document.querySelector(
        '.style_close__16Jzt'
      ) as HTMLElement;
      if (!clearCouponButton) {
        log('Не найдена кнопка очистки купона', 'crimson');
        return false;
      }
      clearCouponButton.click();
    } else {
      const clearCouponButton = document.querySelector(
        '[data-test-id="Betslip-RemoveAllButton"]'
      ) as HTMLElement;
      if (!clearCouponButton) {
        log('Не найдена кнопка очистки купона', 'crimson');
        return false;
      }
      clearCouponButton.click();
      const confirmClearCouponButton = document.querySelector(
        '[data-test-id="Betslip-RemoveAllModal-ConfirmButton"]'
      ) as HTMLElement;
      if (!confirmClearCouponButton) {
        log('Не найдена кнопка подтверждения очистки купона', 'crimson');
        return false;
      }
      confirmClearCouponButton.click();
    }
    const couponCleared = Boolean(await awaiter(() => getStakeCount() === 0));
    if (couponCleared) {
      log('Купон очищен', 'steelblue');
      return true;
    }
    return false;
  }
  log('Купон пуст', 'steelblue');
  return true;
};

export default clearCoupon;
