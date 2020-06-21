import getPinnacleBetType from './getbetType';

const getMarketKey = (
  market: string,
  period: number,
  side: string,
  parameter: number
): string => {
  const betType = getPinnacleBetType(market);
  const betTypeShort = getPinnacleBetType(market, true);
  let key = `s;${period};${betTypeShort}`;
  if (betType === 'moneyline') {
    return key;
  }
  const fixedParameter = ((): string => {
    let result = parameter;
    if (side === 'away') {
      result = -result;
    }
    if (Number.isInteger(result)) {
      return parameter.toFixed(1);
    }
    return String(parameter);
  })();
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
  worker.Helper.WriteLine(
    `Ошибка формирования getMarketKey при индивидуальном тотале (market: ${market})`
  );
  return '';
};

export default getMarketKey;
