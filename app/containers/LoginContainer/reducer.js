/*
 *
 * LoginContainer reducer
 *
 */

import { fromJS } from 'immutable';
import {
  FETCH_TOKEN_REQUEST,
  FETCH_TOKEN_SUCCESS,
  FETCH_TOKEN_FAILURE,
} from './constants';
import { fetchStatus, localStorageKeys } from 'utils/constants/values';

const initialState = fromJS({
  isAuthenticated: false,
  tokenFetchStatus: fetchStatus.none,
});

const setLoginCredentials = action => {
  const { payload: { token, expiration } } = action;
  localStorage.setItem(localStorageKeys.accessToken, token);
  localStorage.setItem(localStorageKeys.expiration, expiration);
};

const removeLoginCredentials = () => {
  localStorage.setItem(localStorageKeys.accessToken, null);
  localStorage.setItem(localStorageKeys.expiration, null);
};

function loginContainerReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_TOKEN_REQUEST:
      return state.set('tokenFetchStatus', fetchStatus.pending);
    case FETCH_TOKEN_SUCCESS:
      setLoginCredentials(action);
      return state.set('tokenFetchStatus', fetchStatus.success)
                  .set('isAuthenticated', true);
    case FETCH_TOKEN_FAILURE:
      removeLoginCredentials();
      return state.set('tokenFetchStatus', fetchStatus.failure)
                  .set('isAuthenticated', false)
                  .set('error', action.error);
    default:
      return state;
  }
}

export default loginContainerReducer;
