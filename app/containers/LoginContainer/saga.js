import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchTokenSuccess, fetchTokenFailure } from './actions';
import request from 'utils/request';
import { FETCH_TOKEN_REQUEST } from './constants';
import { makeRequestURL } from 'utils/componentHelpers';

export function* getToken(action) {
  try {
    const requestURL = makeRequestURL('xy/api/Account/token');
    const { credentials: { userName, password } } = action;
    const options = {
      method: 'POST',
      body: JSON.stringify({
        email: userName,
        password,
      }),
    };

    const payload = yield call(request, [requestURL, options]);
    yield put(fetchTokenSuccess(payload));
  } catch (err) {
    yield put(fetchTokenFailure(err));
  }
}

// Individual exports for testing
export default function* tokenSaga() {
  yield takeLatest(FETCH_TOKEN_REQUEST, getToken);
}
