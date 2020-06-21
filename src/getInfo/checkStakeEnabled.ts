let stakeEnabled = false;

const checkStakeEnabled = (): boolean => stakeEnabled;
export const setStakeEnabled = (enabled: boolean): void => {
  stakeEnabled = enabled;
};

export default checkStakeEnabled;
