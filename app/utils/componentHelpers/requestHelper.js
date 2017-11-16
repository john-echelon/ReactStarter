export const makeRequestURL = (url, isHttps = false) => {
  const { apiDomainName, apiPort, ignoreApiPort } = window.reactAppGlobalContext;
  const requestDomain = `http${isHttps ? 's' : ''}://${apiDomainName}${ignoreApiPort ? '' : `:${apiPort}`}`;
  return `${requestDomain}/${url}`;
};
