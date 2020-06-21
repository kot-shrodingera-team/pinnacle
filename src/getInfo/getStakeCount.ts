const getStakeCount = (): number => {
  return document.querySelectorAll('div[data-test-id="Betslip-Card"]').length;
};

export default getStakeCount;
