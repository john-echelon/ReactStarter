/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Link } from 'react-router-dom';
import HomePage from 'containers/HomePage/Loadable';
import LoginContainer from 'containers/LoginContainer/Loadable';
import CourseContainer from 'containers/CourseContainer/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import PrivateRoute from 'containers/App/AuthenticatedRoute';
import RedirectOnLoginRoute from 'containers/App/NotAuthenticatedRoute';

import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import reducer from 'containers/LoginContainer/reducer';
import { makeSelectTokenContext } from 'containers/LoginContainer/selectors';
import { makeSelectLocation } from './selectors';
import { fetchStatus, localStorageKeys } from 'utils/constants/values';
import { fetchTokenSuccess, removeToken } from 'containers/LoginContainer/actions';
import { isTokenValid } from 'utils/componentHelpers';

class App extends React.Component {
  componentWillMount() {
    const { loginContext: { isAuthenticated }, restoreSession, logout } = this.props;
    const token = localStorage[localStorageKeys.accessToken];
    const expiration = localStorage[localStorageKeys.expiration];
    const isValidToken = isTokenValid(token);

    if (!isValidToken) {
      logout();
    // Attempts to restore the login/token store upon a data lost (e.g. upon a hard reset).
    } else if (!isAuthenticated && isValidToken) {
      restoreSession({ token, expiration });
    }
  }
  render() {
    return (
      <div>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/course">Courses</Link></li>
        </ul>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <RedirectOnLoginRoute path="/login" redirectPath="/course" component={LoginContainer} />
          <PrivateRoute path="/course" redirectPath="/login" component={CourseContainer} />
          <Route path="" component={NotFoundPage} />
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  loginContext: PropTypes.shape({
    isAuthenticated: PropTypes.bool,
    tokenFetchStatus: PropTypes.number,
  }),
  restoreSession: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};
App.defaultProps = {
  loginContext: {
    isAuthenticated: false,
    tokenFetchStatus: fetchStatus.none,
  },
};

const mapStateToProps = createStructuredSelector({
  loginContext: makeSelectTokenContext(),
  location: makeSelectLocation(),
});
function mapDispatchToProps(dispatch) {
  return {
    restoreSession: model => dispatch(fetchTokenSuccess(model)),
    logout: () => dispatch(removeToken()),
  };
}
const withReducer = injectReducer({ key: 'loginContainer', reducer });
const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(withReducer, withConnect)(App);
