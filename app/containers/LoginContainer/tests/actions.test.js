
import {
  fetchTokenRequest,
  fetchTokenSuccess,
  fetchTokenFailure,
  removeToken,
} from '../actions';
import {
  FETCH_TOKEN_REQUEST,
  FETCH_TOKEN_SUCCESS,
  FETCH_TOKEN_FAILURE,
  REMOVE_TOKEN,
} from '../constants';

describe('LoginContainer actions', () => {
  describe('Fetch Token Request Action', () => {
    const expected = {
      type: FETCH_TOKEN_REQUEST,
      credentials: {
        userName: 'brandy.perkins49@example.com',
        password: 'LoremIpsum0',
      },
    };
    const credentials = { userName: 'brandy.perkins49@example.com', password: 'LoremIpsum0' };
    const actual = fetchTokenRequest(credentials);
    it('has a type of FETCH_TOKEN_REQUEST', () => {
      expect(actual.type).toEqual(expected.type);
    });
    it('has the user credentials', () => {
      expect(actual.credentials).toEqual(expected.credentials);
    });
  });

  describe('Fetch Token Success Action', () => {
    const expected = {
      type: FETCH_TOKEN_SUCCESS,
      payload: {
        token: '{access-token}',
        expiration: '2017-11-14T17:51:27Z',
      },
    };
    const payload = {
      token: '{access-token}',
      expiration: '2017-11-14T17:51:27Z',
    };
    it('has a type of FETCH_TOKEN_SUCCESS with payload of token and expiration', () => {
      expect(fetchTokenSuccess(payload)).toEqual(expected);
    });
  });

  describe('Fetch Token Failure Action', () => {
    const expected = {
      type: FETCH_TOKEN_FAILURE,
      error: {
        Login: [
          'Username or Password is invalid.',
        ],
      },
    };
    const error = {
      Login: [
        'Username or Password is invalid.',
      ],
    };
    it('has a type of FETCH_TOKEN_FAILURE with error payload', () => {
      expect(fetchTokenFailure(error)).toEqual(expected);
    });
  });

  describe('Remove Token Action', () => {
    const expected = {
      type: REMOVE_TOKEN,
    };
    it('has a type of REMOVE_TOKEN ', () => {
      expect(removeToken()).toEqual(expected);
    });
  });
});
