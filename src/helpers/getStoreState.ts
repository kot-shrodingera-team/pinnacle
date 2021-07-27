import { log } from '@kot-shrodingera-team/germes-utils';
import { getReactInstance } from '@kot-shrodingera-team/germes-utils/reactUtils';

const getStoreState = (): PinnacleReactStoreState => {
  const account = document.querySelector('[data-gtm-id="super_nav_account"]');
  if (!account) {
    log('Не удалось получить storeState (account)', 'crimson');
    return null;
  }
  const accountReactInstance = getReactInstance(
    account,
  ) as PinnacleAccountReactInstance;
  if (
    !accountReactInstance ||
    !accountReactInstance.return ||
    !accountReactInstance.return.return ||
    !accountReactInstance.return.return.return ||
    !accountReactInstance.return.return.return.memoizedProps ||
    !accountReactInstance.return.return.return.memoizedProps.value ||
    !accountReactInstance.return.return.return.memoizedProps.value.store ||
    !accountReactInstance.return.return.return.memoizedProps.value.store
      .getState
  ) {
    log('Не удалось получить storeState', 'crimson');
    return null;
  }
  return accountReactInstance.return.return.return.memoizedProps.value.store.getState();
};

export default getStoreState;
