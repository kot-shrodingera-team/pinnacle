import { log } from '@kot-shrodingera-team/config/util';
import getPinnacleBetType from './getbetType';

const getMarketKey = (
  market: string,
  period: number,
  side: string,
  parameter: number,
  scoreOffset: number
): string => {
  const betType = getPinnacleBetType(market);
  const betTypeShort = getPinnacleBetType(market, true);
  let key = `s;${period};${betTypeShort}`;
  if (betType === 'moneyline') {
    return key;
  }
  log(`parameter: ${parameter}`, 'steelblue');
  const fixedParameter = ((): string => {
    let result = parameter;
    if (betType === 'spread') {
      if (side === 'away') {
        result = -result;
      }
      result += scoreOffset;
    }
    if (Number.isInteger(result)) {
      return result.toFixed(1);
    }
    return String(result);
  })();
  log(`fixedParameter: ${fixedParameter}`, 'steelblue');
  key = `${key};${fixedParameter}`;
  if (betType !== 'team_total') {
    return key;
  }
  if (/^OU1$/i.test(market)) {
    return `${key};home`;
  }
  if (/^OU2$/i.test(market)) {
    return `${key};away`;
  }
  log(
    `Ошибка формирования getMarketKey при индивидуальном тотале (market: ${market})`,
    'crimson'
  );
  return '';
};

export default getMarketKey;
