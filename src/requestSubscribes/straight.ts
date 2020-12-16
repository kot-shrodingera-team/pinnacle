import { log } from '@kot-shrodingera-team/config/util';
import { setMinimumStake } from '../stake_info/getMinimumStake';

window.request.subscribe(
  'api.arcadia.pinnacle.com/0.1/bets/straight',
  (url, data, method, fullUrl) => {
    try {
      // log('straight');
      if (fullUrl.endsWith('quote')) {
        // log('quote');
        if (method === 'post') {
          // log('post');
          const json = JSON.parse(decodeURIComponent(data));
          // console.log(json);
          if (json.limits && json.limits[0]) {
            setMinimumStake(json.limits[0].amount);
          }
        }
      }
    } catch (e) {
      console.error(`Ошибка обработки ответа от ${url}: ${e}`);
    }
  }
);
