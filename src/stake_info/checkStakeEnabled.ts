const checkStakeEnabled = (): boolean => {
  if (window.germesInfo.loadingStep === 'updateQuoteFail') {
    return false;
  }
  return true;
};

export default checkStakeEnabled;
