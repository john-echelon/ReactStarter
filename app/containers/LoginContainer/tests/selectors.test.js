import { fromJS } from 'immutable';
import { makeSelectTokenContext, makeSelectTokenError } from '../selectors';
import { fetchStatus } from 'utils/constants/values';

describe('selectLoginContainerDomain', () => {
  it('should select the token context', () => {
    const loginContainer = fromJS({
      isAuthenticated: true,
      tokenFetchStatus: fetchStatus.success,
    });
    const mockedState = fromJS({
      loginContainer,
    });
    expect(makeSelectTokenContext()(mockedState)).toEqual(loginContainer.toJS());
  });
  it('should select the token error', () => {
    const loginContainer = fromJS({
      error: {
        Login: [
          'Username or Password is invalid.',
        ],
      },
    });
    const mockedState = fromJS({
      loginContainer,
    });
    expect(makeSelectTokenError()(mockedState)).toEqual(loginContainer.get('error').toJS());
  });
});
