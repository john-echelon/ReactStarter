/**
 *
 * LoginContainer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectTokenContext, makeSelectTokenError } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { fetchTokenRequest } from './actions';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import { linkState } from 'utils/componentHelpers';
import { fetchStatus } from 'utils/constants/values';

export class LoginContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    // const { model } = this.props;
    const model = {
      userName: '',
      password: '',
    };
    this.setState({ model });
  }

  componentWillReceiveProps(nextProps) {
    const { loginContext: { tokenFetchStatus } } = this.props;
    const { loginContext: { nextTokenFetchStatus }, error } = nextProps;
    if (tokenFetchStatus === fetchStatus.pending && nextTokenFetchStatus === fetchStatus.failure) {
      this.setState({ error });
    }
  }

  handleLoginClick = () => {
    const { model } = this.state;
    const { loginRequest } = this.props;
    loginRequest(model);
  }

  render() {
    const { model, error } = this.state;
    return (
      <div>
        <Helmet>
          <title>LoginContainer</title>
          <meta name="description" content="Description of LoginContainer" />
        </Helmet>
        <div>
          <CenteredSection>
            <Form>
            <Input
              id="userName"
              type="text"
              placeholder="Username"
              name="userName"
              onChange={linkState(this, 'userName', 'model')}
              value={model.username}
            />
            <Input
              id="password"
              type="password"
              placeholder="Password"
              name="password"
              onChange={linkState(this, 'password', 'model')}
              value={model.password}
            />
            <button
              type="button"
              onClick={this.handleLoginClick}
            >
              Login
            </button>
            </Form>
          </CenteredSection>
        </div>
        {JSON.stringify(error)}
      </div>
    );
  }
}

LoginContainer.propTypes = {
  loginRequest: PropTypes.func.isRequired,
  loginContext: PropTypes.shape({
    isAuthenticated: PropTypes.bool,
    tokenFetchStatus: PropTypes.number,
  }),
  error: PropTypes.object,
};
LoginContainer.defaultProps = {
  loginContext: {
    isAuthenticated: false,
    tokenFetchStatus: fetchStatus.none,
  },
  error: {},
};
const mapStateToProps = createStructuredSelector({
  loginContext: makeSelectTokenContext(),
  error: makeSelectTokenError(),
});

function mapDispatchToProps(dispatch) {
  return {
    loginRequest: model => dispatch(fetchTokenRequest(model)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'loginContainer', reducer });
const withSaga = injectSaga({ key: 'loginContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(LoginContainer);
