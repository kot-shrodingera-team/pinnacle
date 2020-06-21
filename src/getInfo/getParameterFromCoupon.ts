const getParameterFromCoupon = (): number => {
  try {
    const stakeDetailsElement = document.querySelector(
      'span[data-test-id="SelectionDetails-Selection"]'
    );
    if (!stakeDetailsElement) {
      worker.Helper.WriteLine('Не найдена информация о ставке');
      return 0;
    }
    const stakeDetails = stakeDetailsElement.textContent.trim();
    const parameterRegEx = /[-+]?\d+(?:\.\d+)?$/;
    // let gameOfSetRegEx = /Game \d+ of Set \d+$/;
    const parameterMatch = stakeDetails.match(parameterRegEx);
    if (!parameterMatch /* && gameOfSetRegEx.test(stakeDetails) */) {
      return -6666;
    }
    const parameter = parseFloat(parameterMatch[0]);
    if (
      worker.SportId !== 1 ||
      stakeDetails.startsWith('Under ') ||
      stakeDetails.startsWith('Over ')
    ) {
      return parameter;
    }

    worker.Helper.WriteLine('Расчёт параметра форы от счёта на футболе');
    const stakeTitleScoreElement = document.querySelector(
      'div[data-test-id="SelectionDetails-Title"] > :last-child'
    );
    if (!stakeTitleScoreElement) {
      worker.Helper.WriteLine('Не найден счёт в заголовке ставки');
      return 0;
    }
    const stakeTitleScore = stakeTitleScoreElement.textContent;
    const scoreMatch = stakeTitleScore.match(/(\d)+-(\d+)/);
    if (!scoreMatch) {
      worker.Helper.WriteLine(`Непонятный формат счёта - ${stakeTitleScore}`);
      worker.JSFail();
      return 0;
    }
    const firstTeamScore = Number(scoreMatch[1]);
    const secondTeamScore = Number(scoreMatch[2]);
    if (stakeDetails.includes(worker.TeamOne)) {
      worker.Helper.WriteLine('Фора на первую команду');
      return secondTeamScore - firstTeamScore + parameter;
    }
    if (stakeDetails.includes(worker.TeamTwo)) {
      worker.Helper.WriteLine('Фора на вторую команду');
      return firstTeamScore - secondTeamScore + parameter;
    }
    worker.Helper.WriteLine('Не удалось найти команду в информации о ставке');
    worker.JSFail();
    return -6666;
  } catch (e) {
    worker.Helper.WriteLine(`Ошибка парсинга параметра - ${e}`);
    return -6666;
  }
};

export default getParameterFromCoupon;
