let minimumStake = 0;

const getMinimumStake = (): number => minimumStake;
export const setMinimumStake = (sum: number): void => {
  minimumStake = sum;
};

export default getMinimumStake;
