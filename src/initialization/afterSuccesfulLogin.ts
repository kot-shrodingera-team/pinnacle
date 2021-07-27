import { refreshBalance, updateBalance } from '../stake_info/getBalance';

const afterSuccesfulLogin = async (): Promise<void> => {
  await refreshBalance();
  updateBalance();
};

export default afterSuccesfulLogin;
