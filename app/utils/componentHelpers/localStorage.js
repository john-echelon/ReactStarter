import { localStorageKeys } from 'utils/constants/values';

export const setLoginCredentials = action => {
  const { payload: { token, expiration } } = action;
  localStorage.setItem(localStorageKeys.accessToken, token);
  localStorage.setItem(localStorageKeys.expiration, expiration);
};

export const removeLoginCredentials = () => {
  localStorage.setItem(localStorageKeys.accessToken, null);
  localStorage.setItem(localStorageKeys.expiration, null);
};

