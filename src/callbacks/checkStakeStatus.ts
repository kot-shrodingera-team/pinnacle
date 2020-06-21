import { getIsAcceptBet } from '../stakeData';
import { updateBalance } from '../getInfo/getBalance';

const checkStakeStatus = (): boolean => {
  const isAcceptBet = getIsAcceptBet();
  if (isAcceptBet) {
    worker.Helper.WriteLine('Ставка принята');
    updateBalance();
  } else {
    worker.Helper.WriteLine('Ставка НЕ принята');
    const reuseSelectionButton = document.querySelector(
      'button[data-test-id="Betslip-ReuseButton"]'
    ) as HTMLElement;
    if (reuseSelectionButton) {
      worker.Helper.WriteLine('Переоткрываем купон');
      reuseSelectionButton.click();
    }
  }
  return isAcceptBet;
};

export default checkStakeStatus;
