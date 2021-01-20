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

  if (!window.location.pathname.startsWith('/en')) {
    log('Открыта не английсая версия сайта. Переключаем', 'orange');
    window.location.pathname = '/en/';
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

  const {
    score: betIdScore,
    matchup_id: matchupId,
    rc_score: redCardsBetIdScore = '',
  } = JSON.parse(worker.BetId);
  const pinnaclePeriod = [2, 121].includes(worker.SportId) ? 0 : period;

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

  log('Payload initialized', 'white', true);

  const scoreRegex = /(\d+):(\d+)$/;

  const betIdScoreMatch = betIdScore.match(scoreRegex);
  const betIdScore1 = betIdScoreMatch ? Number(betIdScoreMatch[1]) : 0;
  const betIdScore2 = betIdScoreMatch ? Number(betIdScoreMatch[2]) : 0;
  payload.score = betIdScore1 + betIdScore2;

  const redCardsBetIdScoreMatch = redCardsBetIdScore.match(scoreRegex);
  const redCardsBetIdScore1 = redCardsBetIdScoreMatch
    ? Number(redCardsBetIdScoreMatch[1])
    : 0;
  const redCardsBetIdScore2 = redCardsBetIdScoreMatch
    ? Number(redCardsBetIdScoreMatch[2])
    : 0;
  payload.cards = redCardsBetIdScore1 + redCardsBetIdScore2;

  log('Score and red cards processed', 'white', true);

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

  const scoreOffset = betIdScore1 - betIdScore2;
  payload.marketKey = getMarketKey(
    market,
    pinnaclePeriod,
    payload.designation,
    param,
    scoreOffset
  );

  log('MarketKey processed', 'white', true);

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

  log('SafeKey processed', 'white', true);

  payload.price = 100;

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
  log(JSON.stringify(data), 'white', true);
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
