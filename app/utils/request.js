import 'whatwg-fetch';
import lodash from 'lodash';
import { localStorageKeys } from 'utils/constants/values';
/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
}

const getRequestOptions = (customOptions = {}) => {
    const defaultFetchOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Host: 'localhost:52668',
        Origin: 'localhost:3000',
        Referer: 'localhost:3000',
      },
    };

    const token = localStorage.getItem(localStorageKeys.accessToken);

    if (token !== 'null' && token) {
      defaultFetchOptions.headers.Authorization = `Bearer ${token}`;
    }

    return lodash.merge({}, defaultFetchOptions, customOptions);
  };


/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}
/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export default function request(args) {
  const [url, options] = args;
  const requestOptions = getRequestOptions(options);
  return fetch(url, requestOptions)
      .then(checkStatus)
      .then(parseJSON);
}
