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
    selection: PinnacleSelection;
    rawQuote: PinnacleQuote;
    price: number;
    placeSum: number;
    loadingStep: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    straightResponse: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pendingResponse: any;
    requestId: string;
    pendingDelay: boolean;
    betPlaced: boolean;
  }
}

export const clearGermesData = (): void => {
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

    balance:
      window.germesData && window.germesData.balance
        ? window.germesData.balance
        : -1,
    selection: null,
    rawQuote: null,
    price: 0,
    placeSum: 0,
    loadingStep: null,
    straightResponse: null,
    pendingResponse: null,
    requestId: null,
    pendingDelay: null,
    betPlaced: null,
  };
};

export default {};
