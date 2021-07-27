import getStoreState from './getStoreState';

const updateQuote = async (): Promise<string> => {
  const state = getStoreState();
  if (!state) {
    return 'Не найдены мета данные аккаунта';
  }

  window.germesData.rawQuote = await fetch(
    'https://api.arcadia.pinnacle.com/0.1/bets/straight/quote',
    {
      method: 'post',
      body: JSON.stringify({
        oddsFormat: 'decimal',
        selections: [window.germesData.selection],
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R',
        'X-Device-UUID': state.User.uuid,
        ...(state.User.token ? { 'X-Session': state.User.token } : {}),
      },
    },
  ).then((r) => r.json());

  if (worker.Dev) {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(window.germesData.rawQuote, null, 2));
  }

  if (
    'status' in window.germesData.rawQuote &&
    window.germesData.rawQuote.status !== 200
  ) {
    if (window.germesData.rawQuote.status === 401) {
      worker.Islogin = false;
      worker.JSLogined();
      return 'Ошибка открытия ставки (нет авторизации)';
    }
    if ('title' in window.germesData.rawQuote) {
      return `Ошибка открытия ставки (${window.germesData.rawQuote.title})`;
    }
    return `Ошибка открытия ставки (${window.germesData.rawQuote.status})`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const example = {
  //   classes: [
  //     {
  //       name: 'Straight',
  //       price: 3.06,
  //     },
  //   ],
  //   limits: [
  //     {
  //       amount: 75.94,
  //       type: 'minRiskStake',
  //     },
  //     {
  //       amount: 106319.48,
  //       type: 'maxRiskStake',
  //     },
  //     {
  //       amount: 156.44,
  //       type: 'minWinStake',
  //     },
  //     {
  //       amount: 219018.13,
  //       type: 'maxWinStake',
  //     },
  //   ],
  //   selections: [
  //     {
  //       designation: 'home',
  //       marketKey: 's;0;m',
  //       matchupId: 1255911149,
  //       price: 3.06,
  //     },
  //   ],
  // };

  if (!('limits' in window.germesData.rawQuote)) {
    return 'Ошибка обработки запроса на купон (limits is not in quote)';
  }
  if (!Array.isArray(window.germesData.rawQuote.limits)) {
    return 'Ошибка обработки запроса на купон (limits is not an array)';
  }
  const maxRiskStake = window.germesData.rawQuote.limits.find(
    (v) => v.type && v.type === 'maxRiskStake',
  );
  if (!maxRiskStake) {
    return 'Ошибка обработки запроса на купон (maxRiskStake is not in limits)';
  }
  if (!('amount' in maxRiskStake)) {
    return 'Ошибка обработки запроса на купон (amount is not in maxRiskStake)';
  }
  if (typeof maxRiskStake.amount !== 'number') {
    return 'Ошибка обработки запроса на купон (maxRiskStake.amount is not a number)';
  }
  window.germesData.maximumStake = maxRiskStake.amount;

  const minRiskStake = window.germesData.rawQuote.limits.find(
    (v) => v.type && v.type === 'minRiskStake',
  );
  if (!minRiskStake) {
    return 'Ошибка обработки запроса на купон (minRiskStake is not in limits)';
  }
  if (!('amount' in minRiskStake)) {
    return 'Ошибка обработки запроса на купон (amount is not in minRiskStake)';
  }
  if (typeof minRiskStake.amount !== 'number') {
    return 'Ошибка обработки запроса на купон (minRiskStake.amount is not a number)';
  }
  window.germesData.minimumStake = minRiskStake.amount;

  if (!('selections' in window.germesData.rawQuote)) {
    return 'Ошибка обработки запроса на купон (selections is not in quote)';
  }
  if (!Array.isArray(window.germesData.rawQuote.selections)) {
    return 'Ошибка обработки запроса на купон (selections is not an array)';
  }
  if (window.germesData.rawQuote.selections.length !== 1) {
    return 'Ошибка обработки запроса на купон (selections.length !== 1)';
  }
  if (!('price' in window.germesData.rawQuote.selections[0])) {
    return 'Ошибка обработки запроса на купон (price is not in selections[0])';
  }
  if (typeof window.germesData.rawQuote.selections[0].price !== 'number') {
    return 'Ошибка обработки запроса на купон (price is not a number)';
  }
  window.germesData.selection.price =
    window.germesData.rawQuote.selections[0].price;
  window.germesData.price = window.germesData.rawQuote.selections[0].price;
  return 'success';
};

export default updateQuote;
