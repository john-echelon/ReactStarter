/*
 *
 * LoginContainer actions
 *
 */

import {
  FETCH_TOKEN_REQUEST,
  FETCH_TOKEN_SUCCESS,
  FETCH_TOKEN_FAILURE,
} from './constants';

export function fetchTokenRequest(credentials) {
  return {
    type: FETCH_TOKEN_REQUEST,
    credentials,
  };
}

export function fetchTokenSuccess(payload) {
  return {
    type: FETCH_TOKEN_SUCCESS,
    payload,
  };
}

export function fetchTokenFailure(error) {
  return {
    type: FETCH_TOKEN_FAILURE,
    error,
  };
}
