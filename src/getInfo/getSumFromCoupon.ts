const getSumFromCoupon = (): number => {
  const stakeInput = document.querySelector(
    'div[data-test-id="Betslip-StakeWinInput"] input'
  ) as HTMLInputElement;
  if (!stakeInput) {
    worker.Helper.WriteLine('Не найдено поле ввода суммы ставки');
    return 0;
  }
  return Number(stakeInput.value);
};

export default getSumFromCoupon;
