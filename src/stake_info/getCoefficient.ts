import { log } from '@kot-shrodingera-team/config/util';

const getCoefficient = (): number => {
  const coefficientElement = document.querySelector(
    '[data-test-id="SelectionDetails-Odds"]'
  );

  if (!coefficientElement) {
    log('Коэффициент не найден', 'crimson');
    return 0;
  }
  const coefficientText = coefficientElement.textContent.trim();
  const coefficient = Number(coefficientText);
  if (Number.isNaN(coefficient)) {
    log(`Непонятный формат коэффициента: "${coefficientText}"`, 'crimson');
    return 0;
  }
  return coefficient;
};

export default getCoefficient;
