import { log } from '@kot-shrodingera-team/germes-utils';

const getPinnacleBetType = (short = false): string => {
  const { market, bet_type: betType } = JSON.parse(worker.ForkObj);
  if (betType) {
    if (
      [
        'TOTALS',
        'ASIAN_TOTALS',
        'SETS_TOTALS',
        'TOTALS_CORNERS',
        'ASIAN_TOTALS_CORNERS',
      ].includes(betType)
    ) {
      return short ? 'ou' : 'total';
    }
    if (['TEAM_TOTALS', 'TEAM_TOTALS_CORNERS'].includes(betType)) {
      return short ? 'tt' : 'team_total';
    }
    if (['WIN', 'WIN_CORNERS', 'GAME_WIN'].includes(betType)) {
      return short ? 'm' : 'moneyline';
    }
    if (['HANDICAP', 'SETS_HANDICAP', 'HANDICAP_CORNERS'].includes(betType)) {
      return short ? 's' : 'spread';
    }
    log(`Необрабатываемый тип ставки: "${betType}"`, 'crimson');
    return null;
  }
  if (!market) {
    log('Не найден маркет или тип ставки', 'crimson');
    return null;
  }
  if (/^OU$/i.test(market)) {
    return short ? 'ou' : 'total';
  }
  if (/^(OU1|OU2)$/i.test(market)) {
    return short ? 'tt' : 'team_total';
  }
  if (/^(1X2|ML)$/i.test(market)) {
    return short ? 'm' : 'moneyline';
  }
  if (/^F$/i.test(market)) {
    return short ? 's' : 'spread';
  }
  log(`Необрабатываемый маркет: "${market}"`, 'crimson');
  return null;
};

export default getPinnacleBetType;
