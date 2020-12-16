import { log } from '@kot-shrodingera-team/config/util';

const getMaximumStake = (): number => {
  const maximumStakeElement = document.querySelector(
    '[data-test-id="Betslip-StakeWinInput-MaxWagerLimit"]'
  );
  if (!maximumStakeElement) {
    log('Не найдена максимальная сумма ставки', 'crimson');
    return 0;
  }
  const maximumStakeText = maximumStakeElement.textContent
    .trim()
    .replace(/[\s,']/g, '');
  const maximumStakeMatch = maximumStakeText.match(/(\d+(?:\.\d+)?)/);
  if (!maximumStakeMatch) {
    log(
      `Непонятный формат максимальной ставки: "${maximumStakeText}"`,
      'crimson'
    );
    return 0;
  }
  return Number(maximumStakeMatch[0]);
};

export default getMaximumStake;
