const getStakeCount = (): number => {
  return document.querySelectorAll('[data-test-id="Betslip-Card"]').length;
};

export default getStakeCount;
