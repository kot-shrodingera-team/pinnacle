const getCoefficientFromCoupon = (): number => {
  const stakeOdds = document.querySelector(
    'div[data-test-id="SelectionDetails-Odds"]'
  );
  if (!stakeOdds) {
    worker.Helper.WriteLine('Не найден коэффициент');
    return 0;
  }
  try {
    return parseFloat(stakeOdds.textContent);
  } catch (e) {
    worker.Helper.WriteLine(
      `Ошибка парсинга коэффициента - ${stakeOdds.textContent}`
    );
    return 0;
  }
};

export default getCoefficientFromCoupon;
