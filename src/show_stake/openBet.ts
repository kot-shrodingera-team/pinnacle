import { log } from '@kot-shrodingera-team/germes-utils';
import JsFailError from './errors/jsFailError';
import getMarketKey from './getMarketKey';
import updateQuote from './updateQuote';

const openBet = async (): Promise<void> => {
  log(`ForkObj: ${worker.ForkObj}`, 'white', true);
  log(`BetId: ${worker.BetId}`, 'white', true);

  const { param, odd, period, bet_type: betType, groups } = JSON.parse(
    worker.ForkObj
  );

  if (betType) {
    const {
      matchup_id: matchupId,
      // dest: designation,
      key: marketKey,
    } = JSON.parse(worker.BetId);

    window.germesInfo.selection = {
      matchupId: Number(matchupId),
      marketKey,
      designation: null,
      price: 1,
      ...(typeof param !== 'undefined' ? { points: param } : {}),
    };
    if (!groups) {
      throw new JsFailError('Не удалось определить designation');
    }
    if (groups.dst === 'UNDER') {
      window.germesInfo.selection.designation = 'under';
    } else if (groups.dst === 'OVER') {
      window.germesInfo.selection.designation = 'over';
    } else if (groups.plr === 'P1') {
      window.germesInfo.selection.designation = 'home';
    } else if (groups.plr === 'P2') {
      window.germesInfo.selection.designation = 'away';
    } else if (groups.plr === 'PX') {
      window.germesInfo.selection.designation = 'draw';
    } else {
      throw new JsFailError('Не удалось определить designation');
    }
  } else {
    const { score: betIdScore, matchup_id: matchupId } = JSON.parse(
      worker.BetId
    );

    const scoreRegex = /(\d+):(\d+)$/;

    const betIdScoreMatch = betIdScore.match(scoreRegex);
    const betIdScore1 = betIdScoreMatch ? Number(betIdScoreMatch[1]) : 0;
    const betIdScore2 = betIdScoreMatch ? Number(betIdScoreMatch[2]) : 0;
    const scoreOffset = betIdScore1 - betIdScore2;

    window.germesInfo.selection = {
      matchupId: Number(matchupId),
      marketKey: null as string,
      designation: null as string,
      pitchers: [],
      price: 1,
      ...(typeof param !== 'undefined' ? { points: param } : {}),
    };

    if (odd) {
      if (/^TU$/i.test(odd)) {
        window.germesInfo.selection.designation = 'under';
      } else if (/^TO$/i.test(odd)) {
        window.germesInfo.selection.designation = 'over';
      } else if (/^(1|ML1|F1)$/i.test(odd)) {
        window.germesInfo.selection.designation = 'home';
      } else if (/^(2|ML2|F2)$/i.test(odd)) {
        window.germesInfo.selection.designation = 'away';
      } else if (/^X$/i.test(odd)) {
        window.germesInfo.selection.designation = 'draw';
      } else {
        throw new JsFailError('Не удалось определить designation');
      }
    } else {
      throw new JsFailError('Не удалось определить designation');
    }

    window.germesInfo.selection.marketKey = getMarketKey(
      period || 0,
      window.germesInfo.selection.designation,
      param,
      scoreOffset
    );
    if (!window.germesInfo.selection.marketKey) {
      throw new JsFailError('Не удалось сформировать marketKey');
    }
  }

  const result = await updateQuote();
  if (result !== 'success') {
    throw new JsFailError(result);
  }

  // log(JSON.stringify(quoteJson, null, 2));

  worker.JSStop();
};

export default openBet;
