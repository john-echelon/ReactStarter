import { fromJS } from 'immutable';
import loginContainerReducer from '../reducer';
import { fetchStatus } from 'utils/constants/values';
import * as helperDependencies from 'utils/componentHelpers/localStorage';

import {
  FETCH_TOKEN_REQUEST,
  FETCH_TOKEN_SUCCESS,
  FETCH_TOKEN_FAILURE,
  REMOVE_TOKEN,
} from '../constants';

describe('loginContainerReducer', () => {
  describe('Initial load', () => {
    const initialState = fromJS({
      isAuthenticated: false,
      tokenFetchStatus: fetchStatus.none,
    });
    it('returns the initial state', () => {
      expect(loginContainerReducer(undefined, {})).toEqual(initialState);
    });
  });
  describe('Fetch Token Request', () => {
    const expected = fromJS({
      isAuthenticated: false,
      tokenFetchStatus: fetchStatus.pending,
    });
    const action = {
      type: FETCH_TOKEN_REQUEST,
    };
    it('has fetch status to pending', () => {
      expect(loginContainerReducer(undefined, action)).toEqual(expected);
    });
  });

  describe('Fetch Token Success', () => {
    const action = {
      type: FETCH_TOKEN_SUCCESS,
      payload: { token: 'token', expiration: 'expiration' },
    };
    const expected = fromJS({
      isAuthenticated: true,
      tokenFetchStatus: fetchStatus.success,
    });
    helperDependencies.setLoginCredentials = jest.fn();
    it('has fetch status to success and user is authenticated', () => {
      expect(loginContainerReducer(undefined, action)).toEqual(expected);
    });
    it('has a user session', () => {
      loginContainerReducer(undefined, action);
      expect(helperDependencies.setLoginCredentials).toHaveBeenCalledWith(action);
    });
  });

  describe('Fetch Token Failure', () => {
    const action = {
      type: FETCH_TOKEN_FAILURE,
      error: {
        Login: [
          'Username or Password is invalid.',
        ],
      },
    };
    const expected = fromJS({
      isAuthenticated: false,
      tokenFetchStatus: fetchStatus.failure,
      error: {
        Login: [
          'Username or Password is invalid.',
        ],
      },
    });
    helperDependencies.removeLoginCredentials = jest.fn();
    it('has status to failure with an error payload, and the user is not authenticated', () => {
      expect(loginContainerReducer(undefined, action)).toEqual(expected);
    });
    it('has the user session removed', () => {
      loginContainerReducer(undefined, action);
      expect(helperDependencies.removeLoginCredentials).toHaveBeenCalled();
    });
  });
  describe('Remove Token for logging out', () => {
    const action = {
      type: REMOVE_TOKEN,
    };
    const expected = fromJS({
      isAuthenticated: false,
      tokenFetchStatus: fetchStatus.none,
    });
    it('has status to failure with an error payload, and the user is not authenticated', () => {
      expect(loginContainerReducer(undefined, action)).toEqual(expected);
    });
    it('has the user session removed', () => {
      loginContainerReducer(undefined, action);
      expect(helperDependencies.removeLoginCredentials).toHaveBeenCalled();
    });
  });
  describe('On initial load', () => {
    it('returns ', () => {
    });
  });
});
