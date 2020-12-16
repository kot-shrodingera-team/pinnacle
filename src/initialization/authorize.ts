import { getElement, log } from '@kot-shrodingera-team/config/util';
import { setReactInputValue } from '@kot-shrodingera-team/config/reactUtils';
import { updateBalance } from '../stake_info/getBalance';

const authorize = async (): Promise<void> => {
  const loginInput = await getElement('input#username');
  if (!loginInput) {
    log('Не найдено поле ввода логина', 'crimson');
    return;
  }
  const passwordInput = await getElement('input#password');
  if (!passwordInput) {
    log('Не найдено поле ввода пароля', 'crimson');
    return;
  }
  const loginButton = (await getElement(
    '[data-test-id="header-login-loginButton"] > button'
  )) as HTMLElement;
  if (!loginButton) {
    log('Не найдена кнопка входа', 'crimson');
    return;
  }
  setReactInputValue(loginInput, worker.Login);
  setReactInputValue(passwordInput, worker.Password);
  loginButton.click();
  const logined = await getElement('.icon-profile');
  if (!logined) {
    log('Авторизация не удалась', 'crimson');
    return;
  }
  worker.Islogin = true;
  worker.JSLogined();
  updateBalance();
};

export default authorize;
