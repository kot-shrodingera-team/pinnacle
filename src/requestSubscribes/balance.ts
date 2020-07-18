import { setBalance } from '../getInfo/getBalance';

window.request.subscribe('api.arcadia.pinnacle.com/0.1/wallet/balance', (
  url,
  data,
  method /* , 
  fullUrl */
) => {
  try {
    if (method === 'get') {
      const json = JSON.parse(decodeURIComponent(data));
      if (Object.prototype.hasOwnProperty.call(json, 'amount')) {
        const balance = json.amount;
        setBalance(balance);
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
