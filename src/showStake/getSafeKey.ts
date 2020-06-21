const getSafeKey = (
  period: number,
  betType: string,
  points: number,
  side: string
): string => {
  return `${period}:${betType}:${JSON.stringify(points || 'no-points')}:${
    side || 'no-side'
  }:${'non-teaser'}`;
};

export default getSafeKey;
