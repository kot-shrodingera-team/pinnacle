import { log, awaiter } from '@kot-shrodingera-team/config/util';

export const balanceReady = async (
  timeout = 5000,
  interval = 100
): Promise<boolean> => {
  const balanceLoaded = Boolean(
    await awaiter(
      () => {
        const balanceElement = document.querySelector(
          '[data-test-id="QuickCashier-BankRoll"]'
        );
        if (!balanceElement) {
          return false;
        }
        const balanceText = balanceElement.textContent
          .trim()
          .replace(',', '')
          .replace(/\s/g, '');
        const balanceRegex = /(\d+\.\d+)/;
        const balanceMatch = balanceText.match(balanceRegex);
        return Boolean(balanceMatch);
      },
      timeout,
      interval
    )
  );
  return balanceLoaded;
};

const getBalance = (): number => {
  const balanceElement = document.querySelector(
    '[data-test-id="QuickCashier-BankRoll"]'
  );
  if (!balanceElement) {
    log('Баланс не найден', 'crimson');
    return 0;
  }
  const balanceText = balanceElement.textContent
    .trim()
    .replace(',', '')
    .replace(/\s/g, '');
  const balanceRegex = /(\d+\.\d+)/;
  const balanceMatch = balanceText.match(balanceRegex);
  if (!balanceMatch) {
    log(`Непонятный формат баланса: "${balanceText}"`, 'crimson');
    return 0;
  }
  return Number(balanceMatch[1]);
};

export const updateBalance = (): void => {
  worker.JSBalanceChange(getBalance());
};

export default getBalance;
