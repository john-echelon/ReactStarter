import { createSelector } from 'reselect';

/**
 * Direct selector to the loginContainer state domain
 */
const selectLoginContainerDomain = state => state.get('loginContainer');

/**
 * Other specific selectors
 */

/**
 * Default selector used by LoginContainer
 */

const makeSelectTokenError = () => createSelector(
  selectLoginContainerDomain,
  substate => substate.get('error')
);

const makeSelectTokenContext = () => createSelector(
  selectLoginContainerDomain,
  substate => ({
    isAuthenticated: substate.get('isAuthenticated'),
    tokenFetchStatus: substate.get('tokenFetchStatus'),
  })
);

export default selectLoginContainerDomain;
export {
  makeSelectTokenContext,
  makeSelectTokenError,
};
