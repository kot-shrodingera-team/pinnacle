import { awaiter, getElement, log } from '@kot-shrodingera-team/config/util';
import WorkerBetObject from '@kot-shrodingera-team/config/workerBetObject';
import { getReactInstance } from '@kot-shrodingera-team/config/reactUtils';
import checkAuth, { authCheckReady } from '../stake_info/checkAuth';
import getStakeCount from '../stake_info/getStakeCount';
import getMarketKey from './getMarketKey';
import getSafeKey from './getSafeKey';
import getPinnacleBetType from './getbetType';
import clearCoupon from './clearCoupon';

interface PinnacleEvent {
  status: number;
  participants: {
    0: PinnacleParticipant;
    1: PinnacleParticipant;
  };
}

interface PinnacleParticipant {
  state: {
    redCards: number;
    score: number;
  };
}

interface PinnacleMarket {
  key: string;
  period: number;
  type: string;
  prices: {
    price: number;
    designation: string;
  }[];
  matchupId: number;
}

interface PinnaclePayload {
  cards: number;
  designation: string;
  marketKey: string;
  matchupId: number;
  period: number;
  points: number;
  price: number;
  safeKey: string;
  score: number;
  type: string;
}

interface PinnacleReatRootInstance {
  return: {
    stateNode: {
      props: {
        dispatch: (data: { type: string; payload: PinnaclePayload }) => void;
      };
    };
  };
}

const showStake = async (): Promise<void> => {
  await authCheckReady();
  worker.Islogin = checkAuth();
  worker.JSLogined();
  if (!worker.Islogin) {
    log('Нет авторизации', 'red');
    worker.JSFail();
    return;
  }
  await getElement('#root > div');

  const couponCleared = await clearCoupon();
  if (!couponCleared) {
    log('Не удалось очистить купон', 'red');
    worker.JSFail();
    return;
  }

  log(
    `Ищем ставку\nСобытие: ${worker.TeamOne} - ${worker.TeamTwo}\nИсход: ${worker.BetName}`,
    'steelblue'
  );

  const {
    market,
    odd,
    param,
    period,
    // overtimeType,
  } = JSON.parse(worker.ForkObj) as WorkerBetObject;

  const [marketName, betIdScore, matchupId] = worker.BetId.split('|');
  const pinnaclePeriod = [2, 121].includes(worker.SportId) ? 0 : period;
  const eventId = Number(worker.EventId);

  const payload: PinnaclePayload = {
    cards: undefined,
    designation: undefined,
    marketKey: undefined,
    matchupId: Number(matchupId),
    period: pinnaclePeriod,
    points: param,
    price: undefined,
    safeKey: undefined,
    score: undefined,
    type: getPinnacleBetType(market),
  };

  log('Получаем информацию о событии', 'steelblue');
  const eventResponse = await (async (): Promise<Response> => {
    try {
      return await fetch(
        // eslint-disable-next-line prefer-template
        'https://api.arcadia.pinnacle.com/0.1/matchups/' + eventId,
        {
          method: 'get',
          headers: { 'x-api-key': 'CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R' },
        }
      );
    } catch (e) {
      log(`Ошибка запроса данных о событии: ${e}`, 'red');
      return null;
    }
  })();
  if (!eventResponse) {
    worker.JSFail();
    return;
  }
  const eventJson = (await eventResponse.json()) as PinnacleEvent;
  if (!eventJson || eventJson.status === 404) {
    log('Событие не найдено', 'red');
    worker.JSFail();
    return;
  }
  log('Получили информацию о событии', 'steelblue');
  const betIdScoreRegex = /(\d+):(\d+)$/;
  const betIdScoreMatch = betIdScore.match(betIdScoreRegex);
  const betIdScore1 = betIdScoreMatch ? Number(betIdScoreMatch[1]) : 0;
  const betIdScore2 = betIdScoreMatch ? Number(betIdScoreMatch[2]) : 0;

  // const score1 =
  //   eventJson.participants &&
  //   eventJson.participants[0].state &&
  //   eventJson.participants[0].state.score
  //     ? eventJson.participants[0].state.score
  //     : 0;
  // const score2 =
  //   eventJson.participants &&
  //   eventJson.participants[1].state &&
  //   eventJson.participants[1].state.score
  //     ? eventJson.participants[1].state.score
  //     : 0;

  // payload.score = score1 + score2;
  payload.score = betIdScore1 + betIdScore2;

  const cards1 =
    eventJson.participants &&
    eventJson.participants[0].state &&
    eventJson.participants[0].state.redCards
      ? eventJson.participants[0].state.redCards
      : 0;
  const cards2 =
    eventJson.participants &&
    eventJson.participants[1].state &&
    eventJson.participants[1].state.redCards
      ? eventJson.participants[1].state.redCards
      : 0;
  payload.cards = cards1 + cards2;

  if (/^TU$/i.test(odd)) {
    payload.designation = 'under';
  }
  if (/^TO$/i.test(odd)) {
    payload.designation = 'over';
  }
  if (/^(1|ML1|F1)$/i.test(odd)) {
    payload.designation = 'home';
  }
  if (/^(2|ML2|F2)$/i.test(odd)) {
    payload.designation = 'away';
  }
  if (/^X$/i.test(odd)) {
    payload.designation = 'draw';
  }

  // const scoreOffset = score1 - score2;
  const scoreOffset = betIdScore1 - betIdScore2;
  payload.marketKey = getMarketKey(
    market,
    pinnaclePeriod,
    payload.designation,
    param,
    scoreOffset
  );
  const side = ((): string => {
    if (/^OU1$/i.test(market)) {
      return 'home';
    }
    if (/^OU2$/i.test(market)) {
      return 'away';
    }
    return null;
  })();
  payload.safeKey = getSafeKey(
    pinnaclePeriod,
    getPinnacleBetType(market),
    param,
    side
  );

  log('Получаем информацию о маркетах', 'steelblue');
  const marketsResponse = await (async (): Promise<Response> => {
    try {
      return await fetch(
        // eslint-disable-next-line prefer-template
        'https://api.arcadia.pinnacle.com/0.1/matchups/' +
          eventId +
          '/markets/related/straight',
        {
          method: 'get',
          headers: { 'x-api-key': 'CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R' },
        }
      );
    } catch (e) {
      log(`Ошибка запроса данных о маркетах: ${e}`, 'red');
      return null;
    }
  })();
  if (!marketsResponse) {
    worker.JSFail();
    return;
  }
  const marketsJson = (await marketsResponse.json()) as PinnacleMarket[];
  log('Получили информацию о маркетах', 'steelblue');

  const betType = getPinnacleBetType(market);

  // log(
  //   `Search for ${pinnaclePeriod}|${payload.marketKey}|${betType}|${matchupId}`,
  //   'orange'
  // );
  const targetMarket = marketsJson.find((pinnacleMarket) => {
    // log(
    //   `${pinnacleMarket.period}|${pinnacleMarket.key}|${pinnacleMarket.type}|${pinnacleMarket.matchupId}`,
    //   'coral'
    // );
    return (
      pinnacleMarket.period === pinnaclePeriod &&
      pinnacleMarket.key === payload.marketKey &&
      pinnacleMarket.type === betType &&
      pinnacleMarket.matchupId === Number(matchupId)
    );
  });
  // log(`Счёт из API: ${score1}:${score2}`, 'steelblue');
  // log(`Счёт из BetId: ${betIdScore1}:${betIdScore2}`, 'steelblue');
  // log(`scoreOffset: ${scoreOffset}`);

  if (!targetMarket) {
    log('Нужный маркет не найден', 'red');
    worker.JSFail();
    return;
  }
  log('Нужный маркет найден', 'steelblue');

  const targetPrice = targetMarket.prices.find(
    (price) => price.designation === payload.designation
  );
  payload.price = targetPrice.price;

  const data = {
    type: 'Selections/ADD_TO_SELECTIONS',
    payload,
  };
  window.localStorage.payload = JSON.stringify(data);
  const reactInstance = getReactInstance(
    document.querySelector('#root > div')
  ) as PinnacleReatRootInstance;
  if (!reactInstance) {
    log('API не найден, скорее всего сайт завис', 'red');
    worker.JSFail();
    return;
  }
  log('Делаем запрос на открытие купона', 'steelblue');
  reactInstance.return.stateNode.props.dispatch(data);
  const betAdded = await awaiter(() => getStakeCount() === 1);
  if (!betAdded) {
    log('Ставка не попала в купон', 'red');
    worker.JSFail();
    return;
  }
  log('Ставка попала в купон', 'steelblue');
  await Promise.race([
    getElement('[data-test-id="BetSlip-CardMessage-Title"]', 10000),
    getElement('[class^=style_maxWager__]', 10000),
  ]);
  const betCardMessageTitleElement = document.querySelector(
    '[data-test-id="BetSlip-CardMessage-Title"]'
  ) as HTMLElement;
  if (betCardMessageTitleElement) {
    log(
      `Ошибка открытия купона: "${betCardMessageTitleElement.textContent.trim()}"`,
      'red'
    );
    worker.JSFail();
    return;
  }
  const maxWagerElement = document.querySelector('[class^=style_maxWager__]');
  if (!maxWagerElement) {
    log('Максимум не загрузился', 'red');
    worker.JSFail();
    return;
  }
  // log(`Максимум: "${maxWagerElement.textContent.trim()}"`, 'steelblue');
  log('Ставка успешно открыта', 'green');
  worker.JSStop();
};

export default showStake;
