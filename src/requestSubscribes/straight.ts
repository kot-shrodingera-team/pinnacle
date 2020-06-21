import { setIsPlacingBet, setRequestId } from '../stakeData';

window.request.subscribe('api.arcadia.pinnacle.com/0.1/bets/straight', (
  url,
  data,
  method /* ,
  fullUrl */
) => {
  try {
    if (method === 'post') {
      const json = JSON.parse(decodeURIComponent(data));
      if (json.requestId) {
        setIsPlacingBet(true);
        setRequestId(json.requestId);
      } else {
        setIsPlacingBet(false);
      }
    }
  } catch (e) {
    console.error(`Ошибка обработки ответа от ${url} - ${e}`);
    if (e instanceof URIError) {
      console.error(`Ошибка декодирования URI - ${data}`);
    } else if (e instanceof SyntaxError) {
      console.error(`Ошибка парсинга JSON - ${decodeURIComponent(data)}`);
    }
  }
});
