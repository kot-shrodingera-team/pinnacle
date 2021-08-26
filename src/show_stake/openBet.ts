import { log } from '@kot-shrodingera-team/germes-utils';
import { JsFailError } from '@kot-shrodingera-team/germes-utils/errors';
import getMarketKey from '../helpers/getMarketKey';
import updateQuote from '../helpers/updateQuote';
import clearCoupon from './clearCoupon';

const openBet = async (): Promise<void> => {
  /* ======================================================================== */
  /*                              Очистка купона                              */
  /* ======================================================================== */

  const couponCleared = await clearCoupon();
  if (!couponCleared) {
    throw new JsFailError('Не удалось очистить купон');
  }

  /* ======================================================================== */
  /*                      Формирование данных для поиска                      */
  /* ======================================================================== */

  const {
    param,
    odd,
    period,
    bet_type: betType,
    groups,
  } = JSON.parse(worker.ForkObj);

  if (betType) {
    const {
      matchup_id: matchupId,
      // dest: designation,
      key: marketKey,
    } = JSON.parse(worker.BetId);

    window.germesData.selection = {
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
      window.germesData.selection.designation = 'under';
    } else if (groups.dst === 'OVER') {
      window.germesData.selection.designation = 'over';
    } else if (groups.plr === 'P1') {
      window.germesData.selection.designation = 'home';
    } else if (groups.plr === 'P2') {
      window.germesData.selection.designation = 'away';
    } else if (groups.plr === 'PX') {
      window.germesData.selection.designation = 'draw';
    } else {
      throw new JsFailError('Не удалось определить designation');
    }
  } else {
    const { score: betIdScore, matchup_id: matchupId } = JSON.parse(
      worker.BetId,
    );

    const scoreRegex = /(\d+):(\d+)$/;

    const betIdScoreMatch = betIdScore.match(scoreRegex);
    const betIdScore1 = betIdScoreMatch ? Number(betIdScoreMatch[1]) : 0;
    const betIdScore2 = betIdScoreMatch ? Number(betIdScoreMatch[2]) : 0;
    const scoreOffset = betIdScore1 - betIdScore2;

    window.germesData.selection = {
      matchupId: Number(matchupId),
      marketKey: null as string,
      designation: null as string,
      pitchers: [],
      price: 1,
      ...(typeof param !== 'undefined' ? { points: param } : {}),
    };

    if (odd) {
      if (/^TU$/i.test(odd)) {
        window.germesData.selection.designation = 'under';
      } else if (/^TO$/i.test(odd)) {
        window.germesData.selection.designation = 'over';
      } else if (/^(1|ML1|F1)$/i.test(odd)) {
        window.germesData.selection.designation = 'home';
      } else if (/^(2|ML2|F2)$/i.test(odd)) {
        window.germesData.selection.designation = 'away';
      } else if (/^X$/i.test(odd)) {
        window.germesData.selection.designation = 'draw';
      } else {
        throw new JsFailError('Не удалось определить designation');
      }
    } else {
      throw new JsFailError('Не удалось определить designation');
    }

    window.germesData.selection.marketKey = getMarketKey(
      period || 0,
      window.germesData.selection.designation,
      param,
      scoreOffset,
    );
    if (!window.germesData.selection.marketKey) {
      throw new JsFailError('Не удалось сформировать marketKey');
    }
  }

  /* ======================================================================== */
  /*                               Поиск ставки                               */
  /* ======================================================================== */

  const result = await updateQuote();
  if (result !== 'success') {
    throw new JsFailError(result);
  }

  /* ======================================================================== */
  /*                     Запуск обновления данных о ставке                    */
  /* ======================================================================== */

  window.germesData.updateQuoteIntervalId = setInterval(async () => {
    if (!window.germesData.stopUpdateQuote) {
      const tResult = await updateQuote();
      if (tResult !== 'success') {
        log(tResult, 'crimson');
      }
    }
  }, 500);
};

export default openBet;
