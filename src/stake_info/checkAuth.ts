import { getElement } from '@kot-shrodingera-team/config/util';

export const authCheckReady = async (timeout = 5000): Promise<void> => {
  await Promise.race([
    getElement('.icon-profile', timeout),
    getElement('input#username', timeout),
  ]);
};

const checkAuth = (): boolean => {
  const profileIcon = document.querySelector('.icon-profile');
  return Boolean(profileIcon);
};

export default checkAuth;
