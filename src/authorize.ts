import { awaiter, getElement } from '@kot-shrodingera-team/config/util';
import { setReactInputValue } from '@kot-shrodingera-team/config/reactUtils';
import checkLogin from './getInfo/checkLogin';

const authorize = async (): Promise<void> => {
  worker.Helper.WriteLine('Проверка авторизации');

  await awaiter(
    () => checkLogin() || Boolean(document.querySelector('input#username')),
    20000
  );
  if (!checkLogin()) {
    worker.Islogin = false;
    worker.JSLogined();
    const loginInput = await getElement('input#username');
    if (!loginInput) {
      worker.Helper.WriteLine('LoginFail: не найдено поле ввода логина');
      return;
    }
    const passwordInput = await getElement('input#password');
    if (!passwordInput) {
      worker.Helper.WriteLine('LoginFail: нет найдено поле ввода пароля');
      return;
    }
    const loginButton = (await getElement(
      'div[data-test-id="header-login-loginButton"] > button'
    )) as HTMLElement;
    if (!loginButton) {
      worker.Helper.WriteLine('LoginFail: не найдена кнопка входа');
      return;
    }
    setReactInputValue(loginInput, worker.Login);
    setReactInputValue(passwordInput, worker.Password);
    loginButton.click();
    const logined = await awaiter(checkLogin, 5000, 200);
    if (!logined) {
      worker.Helper.WriteLine('Авторизация не удалась');
    }
  }
};

export default authorize;
