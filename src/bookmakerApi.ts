declare global {
  interface PinnacleAccountReactInstance {
    return: {
      return: {
        return: {
          memoizedProps: {
            value: {
              store: {
                getState: () => PinnacleReactStoreState;
              };
            };
          };
        };
      };
    };
  }

  interface PinnacleReactStoreState {
    User: {
      uuid: string;
      token: string;
    };
  }

  interface PinnacleSelection {
    matchupId: number;
    marketKey: string;
    designation: string;
    pitchers?: [];
    price: number;
    points?: number;
  }

  interface PinnacleQuote {
    status?: number;
    title?: string;
    limits: [
      {
        amount: number;
        type: 'minRiskStake';
      },
      {
        amount: number;
        type: 'maxRiskStake';
      },
      {
        amount: number;
        type: 'minWinStake';
      },
      {
        amount: number;
        type: 'maxWinStake';
      },
    ];
    selections: [
      {
        designation: string;
        marketKey: string;
        matchupId: number;
        price: number;
      },
    ];
  }

  interface GermesData {
    balance: number;
    currency: string;
    selection: PinnacleSelection;
    rawQuote: PinnacleQuote;
    price: number;
    placeSum: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    straightResponse: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pendingResponse: any;
    requestId: string;
    updateQuoteIntervalId: number;
    stopUpdateQuote: boolean;
  }
}

export const clearGermesData = (): void => {
  if (window.germesData && window.germesData.updateManualDataIntervalId) {
    clearInterval(window.germesData.updateManualDataIntervalId);
  }
  if (window.germesData && window.germesData.updateQuoteIntervalId) {
    clearInterval(window.germesData.updateQuoteIntervalId);
  }
  window.germesData = {
    bookmakerName: 'Pinnacle',
    minimumStake: undefined,
    maximumStake: undefined,
    doStakeTime: undefined,
    betProcessingStep: undefined,
    betProcessingAdditionalInfo: undefined,
    betProcessingTimeout: 50000,
    stakeDisabled: undefined,
    stopBetProcessing: () => {
      window.germesData.betProcessingStep = 'error';
      window.germesData.stakeDisabled = true;
    },
    updateManualDataIntervalId: undefined,
    stopUpdateManualData: undefined,
    manualMaximumStake: undefined,
    manualCoefficient: undefined,
    manualParameter: undefined,
    manualStakeEnabled: undefined,

    balance:
      window.germesData && window.germesData.balance
        ? window.germesData.balance
        : -1,
    currency:
      window.germesData && window.germesData.currency
        ? window.germesData.currency
        : undefined,
    selection: undefined,
    rawQuote: undefined,
    price: undefined,
    placeSum: undefined,
    straightResponse: undefined,
    pendingResponse: undefined,
    requestId: undefined,
    updateQuoteIntervalId: undefined,
    stopUpdateQuote: undefined,
  };
};

export default {};
