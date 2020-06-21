let balance: number;

const getBalance = (): number => balance;
export const setBalance = (newBalance: number): void => {
  balance = newBalance;
  worker.JSBalanceChange(balance);
};

export const updateBalance = (): void => {
  worker.JSBalanceChange(balance);
};

export default getBalance;
