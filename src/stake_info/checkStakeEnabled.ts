import checkStakeEnabledGenerator from '@kot-shrodingera-team/germes-generators/stake_info/checkStakeEnabled';
import { log } from '@kot-shrodingera-team/germes-utils';
import getStakeCount from './getStakeCount';

const preCheck = (): boolean => {
  if (!('rawQuote' in window.germesData)) {
    log('No rawQuote', 'white', true);
    return false;
  }
  if (
    'status' in window.germesData.rawQuote &&
    window.germesData.rawQuote.status !== 200
  ) {
    log(
      `rawQuote.status = ${window.germesData.rawQuote.status} != 200`,
      'white',
      true,
    );
    if ('title' in window.germesData.rawQuote) {
      log(
        `rawQuote.title = ${window.germesData.rawQuote.title}`,
        'white',
        true,
      );
    }
    return false;
  }
  return true;
};

const checkStakeEnabled = checkStakeEnabledGenerator({
  preCheck,
  getStakeCount,
  // betCheck: {
  //   selector: '',
  //   errorClasses: [
  //     {
  //       className: '',
  //       message: '',
  //     },
  //   ],
  // },
  // errorsCheck: [
  //   {
  //     selector: '',
  //     message: '',
  //   },
  // ],
  // context: () => document,
});

export default checkStakeEnabled;
