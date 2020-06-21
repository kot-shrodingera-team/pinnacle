import checkStakeEnabled from '../getInfo/checkStakeEnabled';
import getCoefficientFromCoupon from '../getInfo/getCoefficientFromCoupon';
import getParameterFromCoupon from '../getInfo/getParameterFromCoupon';
import { setIsPlacingBet } from '../stakeData';

const doStake = (): boolean => {
  const confirmButton = document.querySelector(
    'button[data-test-id="Betslip-ConfirmBetButton"]'
  ) as HTMLElement;
  if (!confirmButton) {
    worker.Helper.WriteLine('doStakeFail: Не найдена кнопка принятия ставки');
    return false;
  }
  if (!checkStakeEnabled()) {
    worker.Helper.WriteLine('doStakeFail: Ставка не доступна');
    return false;
  }
  if (worker.StakeInfo.Coef !== getCoefficientFromCoupon()) {
    worker.Helper.WriteLine('doStakeFail: Коэффициентф изменился');
    return false;
  }
  if (worker.StakeInfo.Parametr !== getParameterFromCoupon()) {
    worker.Helper.WriteLine('doStakeFail: Параметр изменился');
    return false;
  }
  worker.Helper.WriteLine('Нажимаем "Принять ставку"');
  setIsPlacingBet(true);
  confirmButton.click();
  return true;
};

export default doStake;
