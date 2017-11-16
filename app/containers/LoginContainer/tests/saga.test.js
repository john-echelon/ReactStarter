/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { call, put, takeLatest } from 'redux-saga/effects';
import tokenSaga, { getToken } from '../saga';
import { fetchTokenSuccess, fetchTokenFailure } from '../actions';
import * as mockRequestHelper from 'utils/componentHelpers/requestHelper';
import request from 'utils/request';
import { FETCH_TOKEN_REQUEST } from '../constants';

describe('getToken Saga', () => {
  const action = {
    credentials: {
      userName: 'marilyn415@example.com',
      password: 'Foxtrot329Zulu',
    },
  };
  const payload = {
    token: '{access-token}',
    expiration: '2017-11-14T17:51:27Z',
  };
  const options = {
    method: 'POST',
    body: JSON.stringify({
      email: action.credentials.userName,
      password: action.credentials.password,
    }),
  };
  const expected = ['http://example.com/api/Account/token/', options];
  mockRequestHelper.makeRequestURL = jest.fn();
  mockRequestHelper.makeRequestURL.mockReturnValue(expected[0]);
  let getTokenGenerator;
  beforeEach(() => {
    getTokenGenerator = getToken(action);
    const callDescriptor = getTokenGenerator.next().value;
    expect(callDescriptor).toEqual(call(request, expected));
  });
  it('should call fetchTokenSuccess action if it requests the data successfully', () => {
    const putDescriptor = getTokenGenerator.next(payload).value;
    expect(putDescriptor).toEqual(put(fetchTokenSuccess(payload)));
  });
  it('should call fetchTokenFailure action if the response errors', () => {
    const error = {
      Login: [
        'Username or Password is invalid.',
      ],
    };
    const putDescriptor = getTokenGenerator.throw(error).value;
    expect(putDescriptor).toEqual(put(fetchTokenFailure(error)));
  });
});

describe('tokenSaga Saga', () => {
  const tokenSagaGenerator = tokenSaga();
  it('should start task to watch for FETCH_TOKEN_REQUEST action', () => {
    const takeLatestDescriptor = tokenSagaGenerator.next().value;
    expect(takeLatestDescriptor).toEqual(takeLatest(FETCH_TOKEN_REQUEST, getToken));
  });
});
