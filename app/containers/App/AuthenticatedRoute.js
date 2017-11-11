import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import injectReducer from 'utils/injectReducer';
import reducer from 'containers/LoginContainer/reducer';
import { makeSelectTokenContext } from 'containers/LoginContainer/selectors';

const AuthenticatedRoute = ({ component: Component, redirectPath, ...rest }) => {
  const { loginContext: { isAuthenticated } } = rest;
  return (
    <Route
      {...rest}
      render={routeProps => (
        isAuthenticated
          ? (<Component {...routeProps} />)
          : (
            <Redirect to={{
              pathname: redirectPath,
              state: { from: routeProps.location },
            }}
            />
          )
      )}
    />
  );
};

AuthenticatedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  redirectPath: PropTypes.string.isRequired,
};

const mapStateToProps = createStructuredSelector({
  loginContext: makeSelectTokenContext(),
});
const withReducer = injectReducer({ key: 'loginContainer', reducer });
const withConnect = connect(mapStateToProps);
export default compose(withReducer, withConnect)(AuthenticatedRoute);
