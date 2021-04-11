import authorizeGenerator from '@kot-shrodingera-team/germes-generators/initialization/authorize';
import { updateBalance, balanceReady } from '../stake_info/getBalance';
import afterSuccesfulLogin from './afterSuccesfulLogin';

// const setLoginType = async (): Promise<boolean> => {
//   return true;
// };

const authorize = authorizeGenerator({
  // openForm: {
  //   selector: '',
  //   openedSelector: '',
  //   loopCount: 10,
  //   triesInterval: 1000,
  //   afterOpenDelay: 0,
  // },
  // setLoginType,
  loginInputSelector: 'input#username',
  passwordInputSelector: 'input#password',
  submitButtonSelector: '[data-test-id="header-login-loginButton"] > button',
  inputType: 'react',
  // fireEventNames: ['input'],
  // beforeSubmitDelay: 0,
  // captchaSelector: '',
  loginedWait: {
    loginedSelector: '.icon-profile',
    balanceReady,
    updateBalance,
  },
  afterSuccesfulLogin,
});

export default authorize;
