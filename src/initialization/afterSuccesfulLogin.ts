import { refreshBalance } from '../stake_info/getBalance';

const afterSuccesfulLogin = async (): Promise<void> => {
  await refreshBalance();
};

export default afterSuccesfulLogin;
