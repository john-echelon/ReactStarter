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
import makeSelectLoginContainer from './selectors';
import reducer from './reducer';
import saga from './saga';
import { fetchTokenRequest } from './actions';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import { linkState } from 'utils/componentHelpers';

export class LoginContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    // const { model } = this.props;
    const model = {
      userName: '',
      password: '',
    };
    this.setState({ model });
  }
  handleLoginClick = () => {
    const { model } = this.state;
    const { loginRequest } = this.props;
    loginRequest(model);
  }

  render() {
    const { model } = this.state;
    return (
      <div>
        <Helmet>
          <title>LoginContainer</title>
          <meta name="description" content="Description of LoginContainer" />
        </Helmet>
        <div>
          <CenteredSection>
          <Form method="POST" onSubmit={this.handleLoginClick}>
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
              type="submit"
            >
              Login
            </button>
          </Form>
          </CenteredSection>
        </div>
      </div>
    );
  }
}

LoginContainer.propTypes = {
  loginRequest: PropTypes.func.isRequired,
};

// LoginContainer.defaultProps = {
//   model: {
//     username: '',
//     password: '',
//   },
// };

const mapStateToProps = createStructuredSelector({
  logincontainer: makeSelectLoginContainer(),
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
