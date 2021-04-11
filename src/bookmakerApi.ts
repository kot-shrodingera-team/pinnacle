declare global {
  interface Window {
    germesInfo: {
      selection: {
        matchupId: number;
        marketKey: string;
        designation: string;
        pitchers?: [];
        price: number;
        points?: number;
      };
      rawQuote: {
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
          }
        ];
        selections: [
          {
            designation: string;
            marketKey: string;
            matchupId: number;
            price: number;
          }
        ];
      };
      maximumStake: number;
      minimumStake: number;
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
    };
  }
}

export default {};
