import { localStorageKeys } from 'utils/constants/values';

export const setLoginCredentials = ({ token, expiration }) => {
  localStorage.setItem(localStorageKeys.accessToken, token);
  localStorage.setItem(localStorageKeys.expiration, expiration);
};

export const getLoginCredentials = () => ({
  token: localStorage.getItem(localStorageKeys.accessToken),
  expiration: localStorage.getItem(localStorageKeys.expiration),
});

export const removeLoginCredentials = () => {
  localStorage.setItem(localStorageKeys.accessToken, null);
  localStorage.setItem(localStorageKeys.expiration, null);
};

