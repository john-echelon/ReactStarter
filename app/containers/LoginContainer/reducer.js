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
  REMOVE_TOKEN,
} from './constants';
import { fetchStatus } from 'utils/constants/values';
import { setLoginCredentials, removeLoginCredentials } from 'utils/componentHelpers';

const initialState = fromJS({
  isAuthenticated: false,
  tokenFetchStatus: fetchStatus.none,
  error: {},
});

function tokenReducer(state = initialState, action) {
  switch (action.type) {
  case FETCH_TOKEN_REQUEST:
    return state.set('tokenFetchStatus', fetchStatus.pending);
  case FETCH_TOKEN_SUCCESS:
    setLoginCredentials(action.payload);
    return state.set('tokenFetchStatus', fetchStatus.success)
      .set('isAuthenticated', true);
  case FETCH_TOKEN_FAILURE:
    removeLoginCredentials();
    return state.set('tokenFetchStatus', fetchStatus.failure)
      .set('isAuthenticated', false)
      .set('error', fromJS(action.error));
  case REMOVE_TOKEN:
    removeLoginCredentials();
    return state.set('isAuthenticated', false);
  default:
    return state;
  }
}

export default tokenReducer;
