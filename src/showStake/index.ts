import { awaiter, getElement } from '@kot-shrodingera-team/config/util';
import WorkerBetObject from '@kot-shrodingera-team/config/workerBetObject';
import { getReactInstance } from '@kot-shrodingera-team/config/reactUtils';
import checkLogin from '../getInfo/checkLogin';
import getStakeCount from '../getInfo/getStakeCount';
import getMarketKey from './getMarketKey';
import getSafeKey from './getSafeKey';
import getPinnacleBetType from './getbetType';
import { setBetId, getIsLoaded } from '../stakeData';
import { setStakeEnabled } from '../getInfo/checkStakeEnabled';

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
  worker.Islogin = checkLogin();
  worker.JSLogined();
  if (!worker.Islogin) {
    worker.Helper.WriteLine('JSFail: Нет авторизации');
    return;
  }
  const stakeCount = getStakeCount();
  if (stakeCount > 0) {
    worker.Helper.WriteLine('Купон не пуст');
    const removeButtons = [
      ...document.querySelectorAll('button[class^="style_close__"]'),
    ] as HTMLElement[];
    if (removeButtons.length === 0) {
      worker.Helper.WriteLine(
        'JSFail: Не найдены кнопки удаления ставок из купона'
      );
      worker.JSFail();
      return;
    }
    if (removeButtons.length !== stakeCount) {
      worker.Helper.WriteLine(
        'JSFail: Количество кнопок удаления ставки не равно количеству ставок в купоне'
      );
      worker.JSFail();
      return;
    }
    removeButtons.forEach((button) => button.click());
    await awaiter(() => getStakeCount() === 0);
    if (getStakeCount() > 0) {
      worker.Helper.WriteLine('JSFail: Не удалось очистить купон');
      worker.JSFail();
    }
  }

  await getElement('#root > div');

  const {
    market,
    odd,
    param,
    period,
    // overtimeType,
  } = JSON.parse(worker.ForkObj) as WorkerBetObject;

  const eventId = Number(worker.EventId.split('_')[0]);

  worker.Helper.WriteLine(`EventId1 = ${worker.EventId.split('_')[0]}`);
  worker.Helper.WriteLine(`EventId2 = ${worker.EventId.split('_')[1]}`);

  const payload: PinnaclePayload = {
    cards: undefined,
    designation: undefined,
    marketKey: undefined,
    matchupId: eventId,
    period,
    points: param,
    price: undefined,
    safeKey: undefined,
    score: undefined,
    type: getPinnacleBetType(market),
  };

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
      worker.Helper.WriteLine(`JSFail: Ошибка запроса данных о событии: ${e}`);
      return null;
    }
  })();
  if (!eventResponse) {
    worker.JSFail();
    return;
  }
  const eventJson = (await eventResponse.json()) as PinnacleEvent;
  if (!eventJson || eventJson.status === 404) {
    worker.Helper.WriteLine('Событие не найдено');
    worker.JSFail();
    return;
  }

  const score1 =
    eventJson.participants &&
    eventJson.participants[0].state &&
    eventJson.participants[0].state.score
      ? eventJson.participants[0].state.score
      : 0;
  const score2 =
    eventJson.participants &&
    eventJson.participants[1].state &&
    eventJson.participants[1].state.score
      ? eventJson.participants[1].state.score
      : 0;
  payload.score = score1 + score2;

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

  payload.marketKey = getMarketKey(market, period, payload.designation, param);
  const side = ((): string => {
    if (/^OU1$/i.test(market)) {
      return 'home';
    }
    if (/^OU2$/i.test(market)) {
      return 'away';
    }
    return null;
  })();
  payload.safeKey = getSafeKey(period, getPinnacleBetType(market), param, side);

  const marketsResponse = await (async (): Promise<Response> => {
    try {
      return await fetch(
        // eslint-disable-next-line prefer-template
        'https://api.arcadia.pinnacle.com/0.1/matchups/' +
          eventId +
          '/markets/straight?primaryOnly=false',
        {
          method: 'get',
          headers: { 'x-api-key': 'CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R' },
        }
      );
    } catch (e) {
      worker.Helper.WriteLine(`JSFail: Ошибка запроса данных о маркетах: ${e}`);
      return null;
    }
  })();
  if (!marketsResponse) {
    worker.JSFail();
    return;
  }
  const marketsJson = (await marketsResponse.json()) as PinnacleMarket[];

  const betType = getPinnacleBetType(market);

  console.log(`Search for ${period}|${payload.marketKey}|${betType}`);
  const targetMarket = marketsJson.find((pinnacleMarket) => {
    console.log(
      `${pinnacleMarket.period}|${pinnacleMarket.key}|${pinnacleMarket.type}`
    );
    return (
      pinnacleMarket.period === period &&
      pinnacleMarket.key === payload.marketKey &&
      pinnacleMarket.type === betType
    );
  });

  if (!targetMarket) {
    worker.Helper.WriteLine('Нужный маркет не найден');
    worker.JSFail();
    return;
  }

  const targetPrice = targetMarket.prices.find(
    (price) => price.designation === payload.designation
  );
  payload.price = targetPrice.price;

  const data = {
    type: 'Selections/ADD_TO_SELECTIONS',
    payload,
  };
  setBetId(payload.marketKey);
  setStakeEnabled(true);
  console.log(data);
  (getReactInstance(
    document.querySelector('#root > div')
  ) as PinnacleReatRootInstance).return.stateNode.props.dispatch(data);
  let isOpenedCoupon = await awaiter(() => getStakeCount() === 1);
  if (!isOpenedCoupon) {
    worker.Helper.WriteLine('Купон так и не раскрылся');
    worker.JSFail();
    return;
  }
  isOpenedCoupon = await awaiter(getIsLoaded);
  if (!isOpenedCoupon) {
    worker.Helper.WriteLine('Купон так и не раскрылся');
    worker.JSFail();
    return;
  }
  if (document.querySelector('[class^=style_maxWager__]')) {
    console.log(
      `maxWager = ${
        document.querySelector('[class^=style_maxWager__]').textContent
      }`
    );
  } else {
    console.log('No maxWager element');
  }
  worker.JSStop();
};

export default showStake;
