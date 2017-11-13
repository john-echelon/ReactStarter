import jwtDecode from 'jwt-decode';

export const decodeToken = token => jwtDecode(token);

export const isTokenValid = token => {
  try {
    if (token) {
      if (decodeToken(token).exp > new Date().getTime() / 1000) {
        return true;
      }
    }

    return false;
  } catch (error) {
    return false;
  }
};
