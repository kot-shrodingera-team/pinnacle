const checkLogin = (): boolean => {
  return Boolean(
    document.querySelector('span[data-test-id="QuickCashier-BankRoll"] > span')
  );
};

export default checkLogin;
