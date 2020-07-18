import {
  setIsPlacingBet,
  setRequestId,
  getBetId,
  getIsNeedTrackLoad,
  setIsNeedTrackLoad,
  setIsLoaded,
} from '../stakeData';
import { setStakeEnabled } from '../getInfo/checkStakeEnabled';
import { setMinimumStake } from '../getInfo/getMinimumStake';
import { setMaximumStake } from '../getInfo/getMaximumStake';

window.request.subscribe(
  'api.arcadia.pinnacle.com/0.1/bets/straight',
  (url, data, method, fullUrl) => {
    try {
      if (fullUrl.endsWith('quote')) {
        console.log('quote response');
        if (method === 'post') {
          const json = JSON.parse(decodeURIComponent(data));
          console.log('quote json');
          console.log(json);
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
        return;
      }
      console.log('straight response');
      if (method === 'post') {
        const json = JSON.parse(decodeURIComponent(data));
        console.log('straight json');
        console.log(json);
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
  }
);
