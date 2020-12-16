import { log } from '@kot-shrodingera-team/config/util';

const checkStakeEnabled = (): boolean => {
  const confirmBetButton = document.querySelector(
    'button[data-test-id="Betslip-ConfirmBetButton"]'
  ) as HTMLButtonElement;
  return Boolean(confirmBetButton);
};

export default checkStakeEnabled;
