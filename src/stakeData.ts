let isPlacingBet = false;
let isAcceptBet = false;
let isLoaded = false;
let isNeedTrackLoad = false;
let betId = '';
let requestId = '';

export const getIsPlacingBet = (): boolean => isPlacingBet;
export const setIsPlacingBet = (placingBet: boolean): void => {
  isPlacingBet = placingBet;
};
export const getIsAcceptBet = (): boolean => isAcceptBet;
export const setIsAcceptBet = (acceptBet: boolean): void => {
  isAcceptBet = acceptBet;
};
export const getIsLoaded = (): boolean => isLoaded;
export const setIsLoaded = (loaded: boolean): void => {
  isLoaded = loaded;
};
export const getIsNeedTrackLoad = (): boolean => isNeedTrackLoad;
export const setIsNeedTrackLoad = (needTrackLoad: boolean): void => {
  isNeedTrackLoad = needTrackLoad;
};
export const getBetId = (): string => betId;
export const setBetId = (newBetId: string): void => {
  betId = newBetId;
};
export const getRequestId = (): string => requestId;
export const setRequestId = (newRequestId: string): void => {
  requestId = newRequestId;
};
