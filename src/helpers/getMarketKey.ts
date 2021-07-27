import { log } from '@kot-shrodingera-team/germes-utils';
import getPinnacleBetType from './getbetType';

const getMarketKey = (
  period: number,
  side: string,
  parameter: number,
  scoreOffset: number,
): string => {
  const { market, bet_type: betType, groups } = JSON.parse(worker.ForkObj);
  const pinnacleBetType = getPinnacleBetType();
  const pinnacleBetTypeShort = getPinnacleBetType(true);
  if (!pinnacleBetType || !pinnacleBetTypeShort) {
    return null;
  }
  let fixedPeriod = period;
  if (worker.SportId) {
    fixedPeriod = 0;
  }
  let key = `s;${fixedPeriod};${pinnacleBetTypeShort}`;
  if (pinnacleBetType === 'moneyline') {
    return key;
  }
  log(`parameter: ${parameter}`, 'white', true);
  const fixedParameter = ((): string => {
    let result = parameter;
    if (pinnacleBetType === 'spread') {
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
  log(`fixedParameter: ${fixedParameter}`, 'white', true);
  key = `${key};${fixedParameter}`;
  if (pinnacleBetType !== 'team_total') {
    return key;
  }
  if (betType) {
    if (!groups) {
      log(
        'Ошибка формирования getMarketKey при индивидуальном тотале (не найдены groups)',
        'crimson',
      );
      return null;
    }
    const { plr } = groups;
    if (!plr) {
      log(
        'Ошибка формирования getMarketKey при индивидуальном тотале (не найден plr)',
        'crimson',
      );
      return null;
    }
    if (plr === 'P1') {
      return `${key};home`;
    }
    if (plr === 'P2') {
      return `${key};away`;
    }
    log(
      'Ошибка формирования getMarketKey при индивидуальном тотале (plr не равен P1 или P2)',
      'crimson',
    );
    return null;
  }
  if (/^OU1$/i.test(market)) {
    return `${key};home`;
  }
  if (/^OU2$/i.test(market)) {
    return `${key};away`;
  }
  log(
    'Ошибка формирования getMarketKey при индивидуальном тотале (market не равен OU1 или OU2)',
    'crimson',
  );
  return null;
};

export default getMarketKey;
