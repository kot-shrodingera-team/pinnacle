import checkCouponLoadingGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/checkCouponLoading';
import {
  awaiter,
  checkCouponLoadingError,
  checkCouponLoadingSuccess,
  getRemainingTimeout,
  log,
  sendTGBotMessage,
  sleep,
} from '@kot-shrodingera-team/germes-utils';
import { StateMachine } from '@kot-shrodingera-team/germes-utils/stateMachine';
import getStoreState from '../helpers/getStoreState';
import updateQuote from '../helpers/updateQuote';

const asyncCheck = async () => {
  const machine = new StateMachine();

  machine.promises = {
    gotStraightResponse: awaiter(
      () => window.germesData.straightResponse,
      getRemainingTimeout(),
    ),
  };

  machine.setStates({
    start: {
      entry: async () => {
        log('Начало обработки ставки', 'steelblue');
        const state = getStoreState();
        if (!state) {
          checkCouponLoadingError({
            botMessage: 'Ошибка ставки: Не найдены мета данные аккаунта',
          });
          return;
        }
        const data = {
          oddsFormat: 'decimal',
          acceptBetterPrices: false,
          class: 'Straight',
          selections: [window.germesData.selection],
          stake: window.germesData.placeSum,
          acceptBetterPrice: false,
        };
        window.germesData.straightResponse = null;
        const hostname = window.location.hostname.replace(/^www\./, '');
        fetch(`https://api.arcadia.${hostname}/0.1/bets/straight`, {
          method: 'post',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R',
            'X-Device-UUID': state.User.uuid,
            ...(state.User.token ? { 'X-Session': state.User.token } : {}),
          },
        })
          .then((r) => r.json())
          .then((r) => {
            window.germesData.straightResponse = r;
          });
        window.germesData.betProcessingAdditionalInfo =
          'ожидание ответа о ставке';
      },
    },
    gotStraightResponse: {
      entry: async () => {
        log('Получили ответ о запросе ставки', 'steelblue');
        window.germesData.betProcessingAdditionalInfo = undefined;
        if ('status' in window.germesData.straightResponse) {
          if (
            window.germesData.straightResponse.status !== 'PENDING_ACCEPTANCE'
          ) {
            if ('title' in window.germesData.straightResponse) {
              const { title } = window.germesData.straightResponse;
              if (/^MARKET_CHANGED$/i.test(title)) {
                log('Маркет изменился (MARKET_CHANGED)', 'tomato');
              } else if (/^LINE_CHANGED$/i.test(title)) {
                log('Линия изменилась (LINE_CHANGED)', 'tomato');
              } else if (/^OFFLINE$/i.test(title)) {
                log('Ставка недоступна (OFFLINE)', 'tomato');
              } else {
                const msg = `Ошибка запроса ставки (title: ${window.germesData.straightResponse.title})`;
                log(msg, 'crimson');
                log(JSON.stringify(window.germesData.straightResponse));
                sendTGBotMessage(
                  '1786981726:AAE35XkwJRsuReonfh1X2b8E7k9X4vknC_s',
                  126302051,
                  msg,
                );
              }
            } else {
              const msg = `Ошибка запроса ставки (status: ${window.germesData.straightResponse.status})`;
              log(msg, 'crimson');
              log(JSON.stringify(window.germesData.straightResponse));
              sendTGBotMessage(
                '1786981726:AAE35XkwJRsuReonfh1X2b8E7k9X4vknC_s',
                126302051,
                msg,
              );
            }
            machine.promises = {
              updateQuote: sleep(0),
            };
            return;
          }
        }
        if (!('requestId' in window.germesData.straightResponse)) {
          if (!('status' in window.germesData.straightResponse)) {
            const msg = 'Нет статуса и requestId в ответе на запрос ставки';
            log(msg, 'crimson');
            log(JSON.stringify(window.germesData.straightResponse));
            sendTGBotMessage(
              '1786981726:AAE35XkwJRsuReonfh1X2b8E7k9X4vknC_s',
              126302051,
              msg,
            );
          } else {
            const msg = `Нет requestId в ответе на запрос ставки (status: ${window.germesData.straightResponse.status})`;
            log(msg, 'crimson');
            log(JSON.stringify(window.germesData.straightResponse));
            sendTGBotMessage(
              '1786981726:AAE35XkwJRsuReonfh1X2b8E7k9X4vknC_s',
              126302051,
              msg,
            );
          }
          machine.promises = {
            updateQuote: sleep(0),
          };
          return;
        }
        window.germesData.requestId =
          window.germesData.straightResponse.requestId;
        log(
          `requestId: ${window.germesData.straightResponse.requestId}`,
          'white',
          true,
        );
        machine.promises = {
          sendPending: sleep(0),
        };
      },
    },
    updateQuote: {
      entry: async () => {
        log('Обновляем данные о ставке', 'tan');
        window.germesData.betProcessingAdditionalInfo =
          'обновление данных о ставке';
        const updateResult = await updateQuote();
        window.germesData.betProcessingAdditionalInfo = undefined;
        if (updateResult !== 'success') {
          log('Ошибка обновления данных о ставке', 'crimson');
          // window.germesData.stakeDisabled = true;
        } else {
          log('Обновили данные о ставке', 'orange');
        }
        machine.end = true;
        checkCouponLoadingError({});
      },
    },
    sendPending: {
      entry: async () => {
        const state = getStoreState();
        if (!state) {
          checkCouponLoadingError({
            botMessage: 'Ошибка ставки: Не найдены мета данные аккаунта',
          });
          return;
        }
        window.germesData.pendingResponse = null;
        const hostname = window.location.hostname.replace(/^www\./, '');
        fetch(
          // eslint-disable-next-line prefer-template
          `https://api.arcadia.${hostname}/0.1/bets/pending/` +
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
        machine.promises = {
          gotPending: awaiter(
            () => window.germesData.pendingResponse,
            getRemainingTimeout(),
          ),
        };
        window.germesData.betProcessingAdditionalInfo = 'ожидание pending';
      },
    },
    gotPending: {
      entry: async () => {
        window.germesData.betProcessingAdditionalInfo = undefined;
        if (!('status' in window.germesData.pendingResponse)) {
          log('Нет статуса в ответе на запрос pending', 'crimson');
          checkCouponLoadingError({});
          return;
        }
        if (window.germesData.pendingResponse.status === 'pending') {
          log('Обработка ставки (pending)', 'tan');
          machine.promises = {
            sendPending: sleep(1000),
          };
          return;
        }
        if (window.germesData.pendingResponse.status === 'unsettled') {
          window.germesData.betProcessingAdditionalInfo = 'unsettled';
          checkCouponLoadingSuccess();
          machine.end = true;
          return;
        }
        if (window.germesData.pendingResponse.status === 'rejected') {
          log('Ставка отклонена (rejected)', 'orange');
          machine.promises = {
            updateQuote: sleep(0),
          };
          return;
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
          machine.promises = {
            sendPending: sleep(1000),
          };
          return;
        }
        log(
          `Неизвестный статус pending: ${window.germesData.pendingResponse.status}`,
          'crimson',
        );
        machine.promises = {
          updateQuote: sleep(0),
        };
      },
    },
    timeout: {
      entry: async () => {
        window.germesData.betProcessingAdditionalInfo = null;
        checkCouponLoadingError({
          botMessage: 'Не дождались результата ставки',
          informMessage: 'Не дождались результата ставки',
        });
        machine.end = true;
      },
    },
  });

  machine.start('start');
};

const checkCouponLoading = checkCouponLoadingGenerator({
  asyncCheck,
});

export default checkCouponLoading;
