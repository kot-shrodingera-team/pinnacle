let maximumStake = 0;

const getMaximumStake = (): number => maximumStake;
export const setMaximumStake = (sum: number): void => {
  maximumStake = sum;
};

export default getMaximumStake;
