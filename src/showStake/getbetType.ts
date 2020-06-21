const getPinnacleBetType = (market: string, short = false): string => {
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
  worker.Helper.WriteLine(`Необрабатываемый маркет: ${market}`);
  return null;
};

export default getPinnacleBetType;
