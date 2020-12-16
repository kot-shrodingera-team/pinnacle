import { log } from '@kot-shrodingera-team/config/util';

const getParameter = (): number => {
  const stakeDetailsElement = document.querySelector(
    '[data-test-id="SelectionDetails-Selection"]'
  );
  if (!stakeDetailsElement) {
    log('Ошибка определения параметра: не найдена роспись ставки', 'crimson');
    return -9999;
  }
  const stakeDetails = stakeDetailsElement.textContent.trim();
  const parameterRegEx = /[-+]?\d+(?:\.\d+)?$/;
  // let gameOfSetRegEx = /Game \d+ of Set \d+$/;
  const parameterMatch = stakeDetails.match(parameterRegEx);
  if (!parameterMatch /* && gameOfSetRegEx.test(stakeDetails) */) {
    return -6666;
  }
  const parameter = Number(parameterMatch[0]);
  if (worker.SportId !== 1 || /^(Under|Over)\s/i.test(stakeDetails)) {
    return parameter;
  }

  log('Расчёт параметра форы от счёта на футболе', 'steelblue');
  const stakeTitleScoreElement = document.querySelector(
    '[data-test-id="SelectionDetails-Title"] > :last-child'
  );
  if (!stakeTitleScoreElement) {
    log(
      'Ошибка расчёта форы от счёта: не найден счёт в заголовке ставки',
      'crimson'
    );
    return -9999;
  }
  const stakeTitleScore = stakeTitleScoreElement.textContent.trim();
  const scoreMatch = stakeTitleScore.match(/(\d)+-(\d+)/);
  if (!scoreMatch) {
    log(
      `Ошибка расчёта форы от счёта: непонятный формат счёта: "${stakeTitleScore}"`,
      'crimson'
    );
    return -9999;
  }
  const firstTeamScore = Number(scoreMatch[1]);
  const secondTeamScore = Number(scoreMatch[2]);
  const scoreOffset = firstTeamScore - secondTeamScore;
  if (stakeDetails.includes(worker.TeamOne)) {
    log('Фора на первую команду', 'steelblue');
    return parameter - scoreOffset;
  }
  if (stakeDetails.includes(worker.TeamTwo)) {
    log('Фора на вторую команду', 'steelblue');
    return parameter + scoreOffset;
  }
  log(
    'Ошибка расчёта форы от счёта: не найдено название команды в росписи ставки',
    'crimson'
  );
  return -9999;
};

export default getParameter;
