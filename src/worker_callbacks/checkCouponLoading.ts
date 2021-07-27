import {
  getWorkerParameter,
  log,
  sendTGBotMessage,
} from '@kot-shrodingera-team/germes-utils';
import getStoreState from '../helpers/getStoreState';
import updateQuote from '../helpers/updateQuote';

const checkCouponLoading = (): boolean => {
  if (getWorkerParameter('fakeDoStake')) {
    log('[fake] Обработка ставки завершена', 'orange');
    return false;
  }
  if (window.germesData.loadingStep === 'waitStraight') {
    if (!window.germesData.straightResponse) {
      log('Обработка ставки (нет ответа о ставке)', 'tan');
      return true;
    }
    if ('status' in window.germesData.straightResponse) {
      if (window.germesData.straightResponse.status !== 'PENDING_ACCEPTANCE') {
        if ('title' in window.germesData.straightResponse) {
          const { title } = window.germesData.straightResponse;
          if (/^MARKET_CHANGED$/i.test(title)) {
            log('Маркет изменился (MARKET_CHANGED)', 'tomato');
          } else if (/^LINE_CHANGED$/i.test(title)) {
            log('Линия изменилась (LINE_CHANGED)', 'tomato');
          } else if (/^OFFLINE$/i.test(title)) {
            log('Ставка недоступна (OFFLINE)', 'tomato');
          } else {
            log(
              `Ошибка запроса ставки (title: ${window.germesData.straightResponse.title})`,
              'crimson',
            );
            log(JSON.stringify(window.germesData.straightResponse));
            sendTGBotMessage(
              '1786981726:AAE35XkwJRsuReonfh1X2b8E7k9X4vknC_s',
              126302051,
              `Ошибка запроса ставки (title: ${window.germesData.straightResponse.title})`,
            );
          }
        } else {
          log(
            `Ошибка запроса ставки (status: ${window.germesData.straightResponse.status})`,
            'crimson',
          );
          log(JSON.stringify(window.germesData.straightResponse));
          sendTGBotMessage(
            '1786981726:AAE35XkwJRsuReonfh1X2b8E7k9X4vknC_s',
            126302051,
            `Ошибка запроса ставки (status: ${window.germesData.straightResponse.status})`,
          );
        }
        log('Обработка ставки завершена', 'orange');
        window.germesData.loadingStep = 'beforeUpdateQuote';
        return true;
      }
    }
    if (!('requestId' in window.germesData.straightResponse)) {
      if (!('status' in window.germesData.straightResponse)) {
        log('Нет статуса и requestId в ответе на запрос ставки', 'crimson');
        log(JSON.stringify(window.germesData.straightResponse));
        sendTGBotMessage(
          '1786981726:AAE35XkwJRsuReonfh1X2b8E7k9X4vknC_s',
          126302051,
          'Нет статуса и requestId в ответе на запрос ставки',
        );
      } else {
        log(
          `Нет requestId в ответе на запрос ставки (status: ${window.germesData.straightResponse.status})`,
          'crimson',
        );
        log(JSON.stringify(window.germesData.straightResponse));
        sendTGBotMessage(
          '1786981726:AAE35XkwJRsuReonfh1X2b8E7k9X4vknC_s',
          126302051,
          `Нет requestId в ответе на запрос ставки (status: ${window.germesData.straightResponse.status})`,
        );
      }
      log('Обработка ставки завершена', 'orange');
      window.germesData.loadingStep = 'beforeUpdateQuote';
      return true;
    }
    window.germesData.requestId = window.germesData.straightResponse.requestId;
    log(
      `requestId: ${window.germesData.straightResponse.requestId}`,
      'white',
      true,
    );
    window.germesData.loadingStep = 'sendPending';
    return true;
  }
  if (window.germesData.loadingStep === 'sendPending') {
    const state = getStoreState();
    if (!state) {
      log('Ошибка ставки: Не найдены мета данные аккаунта', 'crimson');
      return false;
    }
    window.germesData.pendingResponse = null;
    fetch(
      // eslint-disable-next-line prefer-template
      'https://api.arcadia.pinnacle.com/0.1/bets/pending/' +
        window.germesData.requestId,
      {
        method: 'get',
        headers: {
          'X-API-Key': 'CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R',
          'X-Device-UUID': state.User.uuid,
          ...(state.User.token ? { 'X-Session': state.User.token } : {}),
        },
      },
    )
      .then((r) => r.json())
      .then((r) => {
        window.germesData.pendingResponse = r;
      });
    window.germesData.loadingStep = 'pending';
    return true;
  }
  if (window.germesData.loadingStep === 'pending') {
    if (!window.germesData.pendingResponse) {
      log('Обработка ставки (ожидание pending)', 'tan');
      return true;
    }
    if (!('status' in window.germesData.pendingResponse)) {
      log('Нет статуса в ответе на запрос pending', 'crimson');
      log('Обработка ставки завершена', 'orange');
      return false;
    }
    if (window.germesData.pendingResponse.status === 'pending') {
      log('Обработка ставки (pending)', 'tan');
      window.germesData.pendingDelay = false;
      setTimeout(() => {
        window.germesData.pendingDelay = true;
      }, 1000);
      window.germesData.loadingStep = 'pendingDelay';
      return true;
    }
    if (window.germesData.pendingResponse.status === 'unsettled') {
      log('Обработка ставки завершена (unsettled)', 'orange');
      window.germesData.betPlaced = true;
      return false;
    }
    if (window.germesData.pendingResponse.status === 'rejected') {
      log('Обработка ставки завершена (rejected)', 'orange');
      window.germesData.loadingStep = 'beforeUpdateQuote';
      return true;
    }
    if (
      window.germesData.pendingResponse.status === 500 ||
      window.germesData.pendingResponse.status === '500'
    ) {
      if (window.germesData.pendingResponse.status === 500) {
        log('Обработка ставки (int(500))', 'tan');
      }
      if (window.germesData.pendingResponse.status === '500') {
        log('Обработка ставки (str(500))', 'tan');
      }
      window.germesData.pendingDelay = false;
      setTimeout(() => {
        window.germesData.pendingDelay = true;
      }, 1000);
      window.germesData.loadingStep = 'pendingDelay';
      return true;
    }
    log(
      `Неизвестный статус pending: ${window.germesData.pendingResponse.status}`,
      'crimson',
    );
    log('Обработка ставки завершена', 'orange');
    window.germesData.loadingStep = 'beforeUpdateQuote';
    return true;
  }
  if (window.germesData.loadingStep === 'pendingDelay') {
    if (!window.germesData.pendingDelay) {
      log('Обработка ставки (pending delay)', 'tan');
      return true;
    }
    log('Обработка ставки (pending delay end)', 'tan');
    window.germesData.loadingStep = 'sendPending';
    return true;
  }
  if (window.germesData.loadingStep === 'beforeUpdateQuote') {
    log('Обновляем данные о ставке', 'tan');
    updateQuote().then((result) => {
      if (result !== 'success') {
        log(result, 'crimson');
        window.germesData.loadingStep = 'updateQuoteFail';
      } else {
        window.germesData.loadingStep = 'updateQuoteOk';
      }
    });
    window.germesData.loadingStep = 'updateQuote';
    return true;
  }
  if (window.germesData.loadingStep === 'updateQuote') {
    log('Обновляем данные о ставке (ожидание)', 'tan');
    return true;
  }
  if (window.germesData.loadingStep === 'updateQuoteFail') {
    log('Ошибка обновления данных о ставке', 'orange');
    return false;
  }
  if (window.germesData.loadingStep === 'updateQuoteOk') {
    log('Обновили данные о ставке', 'orange');
    return false;
  }
  log(`Неизвестный step: ${window.germesData.loadingStep}`, 'crimson');
  log('Обработка ставки завершена', 'orange');
  return false;
};

export default checkCouponLoading;
