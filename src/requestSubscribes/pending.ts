import { getRequestId, setIsPlacingBet, setIsAcceptBet } from '../stakeData';

window.request.subscribe(
  'api.arcadia.pinnacle.com/0.1/bets/pending',
  (
    url,
    data,
    /* method, */
    fullUrl
  ) => {
    try {
      const requestId = getRequestId();
      if (requestId === '') {
        worker.Helper.WriteLine('Id купона отсутствует');
        return;
      }

      if (!fullUrl.includes(requestId)) {
        worker.Helper.WriteLine(
          `Url не содержит нужный Id купона - ${requestId}`
        );
        return;
      }

      const json = JSON.parse(decodeURIComponent(data));
      if (json.status) {
        console.log(`Статус ставки - ${json.status}`);
      }
      if (json.toWin) {
        setIsPlacingBet(false);
        setIsAcceptBet(true);
      } else if (json.status === 'rejected') {
        worker.Helper.WriteLine('Ставка отклонена');
        setIsPlacingBet(false);
      }
    } catch (e) {
      console.error(`Ошибка обработки ответа от ${url} - ${e}`);
      if (e instanceof URIError) {
        console.error(`Ошибка декодирования URI - ${data}`);
      } else if (e instanceof SyntaxError) {
        console.error(`Ошибка парсинга JSON - ${decodeURIComponent(data)}`);
      }
    }
  }
);
