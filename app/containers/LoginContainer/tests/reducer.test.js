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
      error: {},
    });
    it('returns the initial state', () => {
      expect(loginContainerReducer(undefined, {})).toEqual(initialState);
    });
  });
  describe('Fetch Token Request', () => {
    const expected = fromJS({
      tokenFetchStatus: fetchStatus.pending,
    });
    const action = {
      type: FETCH_TOKEN_REQUEST,
    };
    const actual = loginContainerReducer(undefined, action);
    it('has fetch status to pending', () => {
      expect(actual.tokenFetchStatus).toEqual(expected.tokenFetchStatus);
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
    const actual = loginContainerReducer(undefined, action);
    it('has fetch status to success', () => {
      expect(actual.tokenFetchStatus).toEqual(expected.tokenFetchStatus);
    });
    it('has user authenticated', () => {
      expect(actual.isAuthenticated).toEqual(expected.isAuthenticated);
    });
    it('has a user session', () => {
      expect(helperDependencies.setLoginCredentials).toHaveBeenCalledWith(action.payload);
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
    const actual = loginContainerReducer(undefined, action);
    it('has status to failure', () => {
      expect(actual.tokenFetchStatus).toEqual(expected.tokenFetchStatus);
    });
    it('has user not authenticated', () => {
      expect(actual.isAuthenticated).toEqual(expected.isAuthenticated);
    });
    it('has an error payload', () => {
      expect(actual.error).toEqual(expected.error);
    });
    it('has the user session removed', () => {
      expect(helperDependencies.removeLoginCredentials).toHaveBeenCalled();
    });
  });
  describe('Remove Token for logging out', () => {
    const action = {
      type: REMOVE_TOKEN,
    };
    const expected = fromJS({
      isAuthenticated: false,
    });
    helperDependencies.removeLoginCredentials = jest.fn();
    const actual = loginContainerReducer(undefined, action);
    it('has user not authenticated', () => {
      expect(actual.isAuthenticated).toEqual(expected.isAuthenticated);
    });
    it('has the user session removed', () => {
      expect(helperDependencies.removeLoginCredentials).toHaveBeenCalled();
    });
  });
});
