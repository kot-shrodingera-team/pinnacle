import { log, timeString } from '@kot-shrodingera-team/germes-utils';
import { getReactInstance } from '@kot-shrodingera-team/germes-utils/reactUtils';
import updateQuote from '../show_stake/updateQuote';

const sendTGBotMessage = (
  token: string,
  chatId: number,
  message: string
): Promise<Response> => {
  const timestamp = timeString(new Date());
  const fullMessage =
    `[${timestamp}]\n` +
    `[${worker.ApiKey}/Pinnacle]\n` +
    `${message.replace(/"/g, '\\"')}`;
  // eslint-disable-next-line no-useless-escape
  return fetch(`https:\/\/api.telegram.org/bot${token}/sendMessage`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: `{"chat_id": "${chatId}","text": "${fullMessage}","disable_notification": false}`,
  });
};

const getStoreState = () => {
  const account = document.querySelector('[data-gtm-id="super_nav_account"]');
  if (!account) {
    return null;
  }
  return (getReactInstance(
    account
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as any).return.return.return.memoizedProps.value.store.getState();
};

const checkCouponLoading = (): boolean => {
  if (window.germesInfo.loadingStep === 'waitStraight') {
    if (!window.germesInfo.straightResponse) {
      log('Обработка ставки (нет ответа о ставке)', 'tan');
      return true;
    }
    if ('status' in window.germesInfo.straightResponse) {
      if (window.germesInfo.straightResponse.status !== 'PENDING_ACCEPTANCE') {
        if ('title' in window.germesInfo.straightResponse) {
          log(
            `Ошибка запроса ставки (title: ${window.germesInfo.straightResponse.title})`,
            'crimson'
          );
          log(JSON.stringify(window.germesInfo.straightResponse));
          sendTGBotMessage(
            '1786981726:AAE35XkwJRsuReonfh1X2b8E7k9X4vknC_s',
            126302051,
            `Ошибка запроса ставки (title: ${window.germesInfo.straightResponse.title})`
          );
        } else {
          log(
            `Ошибка запроса ставки (status: ${window.germesInfo.straightResponse.status})`,
            'crimson'
          );
          log(JSON.stringify(window.germesInfo.straightResponse));
          sendTGBotMessage(
            '1786981726:AAE35XkwJRsuReonfh1X2b8E7k9X4vknC_s',
            126302051,
            `Ошибка запроса ставки (status: ${window.germesInfo.straightResponse.status})`
          );
        }
        log('Обработка ставки завершена', 'orange');
        window.germesInfo.loadingStep = 'beforeUpdateQuote';
        return true;
      }
    }
    if (!('requestId' in window.germesInfo.straightResponse)) {
      if (!('status' in window.germesInfo.straightResponse)) {
        log('Нет статуса и requestId в ответе на запрос ставки', 'crimson');
        log(JSON.stringify(window.germesInfo.straightResponse));
        sendTGBotMessage(
          '1786981726:AAE35XkwJRsuReonfh1X2b8E7k9X4vknC_s',
          126302051,
          'Нет статуса и requestId в ответе на запрос ставки'
        );
      } else {
        log(
          `Нет requestId в ответе на запрос ставки (status: ${window.germesInfo.straightResponse.status})`,
          'crimson'
        );
        log(JSON.stringify(window.germesInfo.straightResponse));
        sendTGBotMessage(
          '1786981726:AAE35XkwJRsuReonfh1X2b8E7k9X4vknC_s',
          126302051,
          `Нет requestId в ответе на запрос ставки (status: ${window.germesInfo.straightResponse.status})`
        );
      }
      log('Обработка ставки завершена', 'orange');
      window.germesInfo.loadingStep = 'beforeUpdateQuote';
      return true;
    }
    window.germesInfo.requestId = window.germesInfo.straightResponse.requestId;
    log(
      `requestId: ${window.germesInfo.straightResponse.requestId}`,
      'white',
      true
    );
    window.germesInfo.loadingStep = 'sendPending';
    return true;
  }
  if (window.germesInfo.loadingStep === 'sendPending') {
    const state = getStoreState();
    if (!state) {
      log('Ошибка ставки: Не найдены мета данные аккаунта', 'crimson');
      return false;
    }
    window.germesInfo.pendingResponse = null;
    fetch(
      // eslint-disable-next-line prefer-template
      'https://api.arcadia.pinnacle.com/0.1/bets/pending/' +
        window.germesInfo.requestId,
      {
        method: 'get',
        headers: {
          'X-API-Key': 'CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R',
          'X-Device-UUID': state.User.uuid,
          ...(state.User.token ? { 'X-Session': state.User.token } : {}),
        },
      }
    )
      .then((r) => r.json())
      .then((r) => {
        window.germesInfo.pendingResponse = r;
      });
    window.germesInfo.loadingStep = 'pending';
    return true;
  }
  if (window.germesInfo.loadingStep === 'pending') {
    if (!window.germesInfo.pendingResponse) {
      log('Обработка ставки (ожидание pending)', 'tan');
      return true;
    }
    if (!('status' in window.germesInfo.pendingResponse)) {
      log('Нет статуса в ответе на запрос pending', 'crimson');
      log('Обработка ставки завершена', 'orange');
      return false;
    }
    if (window.germesInfo.pendingResponse.status === 'pending') {
      log('Обработка ставки (pending)', 'tan');
      window.germesInfo.pendingDelay = false;
      setTimeout(() => {
        window.germesInfo.pendingDelay = true;
      }, 1000);
      window.germesInfo.loadingStep = 'pendingDelay';
      return true;
    }
    if (window.germesInfo.pendingResponse.status === 'unsettled') {
      log('Обработка ставки завершена (unsettled)', 'orange');
      window.germesInfo.betPlaced = true;
      return false;
    }
    if (window.germesInfo.pendingResponse.status === 'rejected') {
      log('Обработка ставки завершена (rejected)', 'orange');
      window.germesInfo.loadingStep = 'beforeUpdateQuote';
      return true;
    }
    if (
      window.germesInfo.pendingResponse.status === 500 ||
      window.germesInfo.pendingResponse.status === '500'
    ) {
      if (window.germesInfo.pendingResponse.status === 500) {
        log('Обработка ставки (int(500))', 'tan');
      }
      if (window.germesInfo.pendingResponse.status === '500') {
        log('Обработка ставки (str(500))', 'tan');
      }
      window.germesInfo.pendingDelay = false;
      setTimeout(() => {
        window.germesInfo.pendingDelay = true;
      }, 1000);
      window.germesInfo.loadingStep = 'pendingDelay';
      return true;
    }
    log(
      `Неизвестный статус pending: ${window.germesInfo.pendingResponse.status}`,
      'crimson'
    );
    log('Обработка ставки завершена', 'orange');
    window.germesInfo.loadingStep = 'beforeUpdateQuote';
    return true;
  }
  if (window.germesInfo.loadingStep === 'pendingDelay') {
    if (!window.germesInfo.pendingDelay) {
      log('Обработка ставки (pending delay)', 'tan');
      return true;
    }
    log('Обработка ставки (pending delay end)', 'tan');
    window.germesInfo.loadingStep = 'sendPending';
    return true;
  }
  if (window.germesInfo.loadingStep === 'beforeUpdateQuote') {
    log('Обновляем данные о ставке', 'tan');
    updateQuote().then((result) => {
      if (result !== 'success') {
        log(result, 'crimson');
        window.germesInfo.loadingStep = 'updateQuoteFail';
      } else {
        window.germesInfo.loadingStep = 'updateQuoteOk';
      }
    });
    window.germesInfo.loadingStep = 'updateQuote';
    return true;
  }
  if (window.germesInfo.loadingStep === 'updateQuote') {
    log('Обновляем данные о ставке (ожидание)', 'tan');
    return true;
  }
  if (window.germesInfo.loadingStep === 'updateQuoteFail') {
    log('Ошибка обновления данных о ставке', 'orange');
    return false;
  }
  if (window.germesInfo.loadingStep === 'updateQuoteOk') {
    log('Обновили данные о ставке', 'orange');
    return false;
  }
  log(`Неизвестный step: ${window.germesInfo.loadingStep}`, 'crimson');
  log('Обработка ставки завершена', 'orange');
  return false;
};

export default checkCouponLoading;
