import { setReactInputValue } from '@kot-shrodingera-team/config/reactUtils';

const setStakeSumm = (sum: number): boolean => {
  const stakeInput = document.querySelector(
    'div[data-test-id="Betslip-StakeWinInput"] input'
  );
  if (!stakeInput) {
    worker.Helper.WriteLine('Не найдено поле ввода суммы ставки');
    return false;
  }
  try {
    setReactInputValue(stakeInput, sum);
    return true;
  } catch (e) {
    worker.Helper.WriteLine(`Ошибка ввода суммы ставки - ${e}`);
    return false;
  }
};

export default setStakeSumm;
