import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchTokenSuccess, fetchTokenFailure } from './actions';
import request from 'utils/request';
import { FETCH_TOKEN_REQUEST } from './constants';

// TODO replace action param with selectors
export function* getToken(action) {
  try {
    const requestURL = 'http://localhost:52668/api/Account/token';
    const { credentials: { userName, password } } = action;
    const options = {
      method: 'POST',
      body: JSON.stringify({
        email: userName,
        password,
        rememberMe: true,
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
