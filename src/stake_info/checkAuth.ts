import checkAuthGenerator, {
  authStateReadyGenerator,
} from '@kot-shrodingera-team/germes-generators/stake_info/checkAuth';

export const noAuthElementSelector = 'input#username';
export const authElementSelector = '.icon-profile';

export const authStateReady = authStateReadyGenerator({
  noAuthElementSelector: 'input#username',
  authElementSelector: '.icon-profile',
  // maxDelayAfterNoAuthElementAppeared: 0,
  // context: () => document,
});

const checkAuth = checkAuthGenerator({
  authElementSelector,
  // context: () => document,
});

export default checkAuth;
