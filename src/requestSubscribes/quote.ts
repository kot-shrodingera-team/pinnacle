import { setStakeEnabled } from '../getInfo/checkStakeEnabled';
import {
  getBetId,
  getIsNeedTrackLoad,
  setIsNeedTrackLoad,
  setIsLoaded,
} from '../stakeData';
import { setMinimumStake } from '../getInfo/getMinimumStake';
import { setMaximumStake } from '../getInfo/getMaximumStake';

window.request.subscribe('api.arcadia.pinnacle.com/0.1/bets/straight/quote', (
  url,
  data,
  method /* ,
  fullUrl */
) => {
  try {
    if (method === 'post') {
      const json = JSON.parse(decodeURIComponent(data));
      if (!json.selections || !json.selections[0]) {
        setStakeEnabled(false);
        return;
      }
      if (json.selections[0].marketKey === getBetId()) {
        if (getIsNeedTrackLoad()) {
          setIsNeedTrackLoad(false);
          setIsLoaded(true);
        }

        if (json.limits && json.limits[0]) {
          setMinimumStake(json.limits[0].amount);
        }
        if (json.limits && json.limits[1]) {
          setMaximumStake(json.limits[1].amount);
        }

        setStakeEnabled(true);
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
