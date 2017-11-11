/**
 *
 * CourseContainer
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
import makeSelectCourseContainer from './selectors';
import reducer from './reducer';
import saga from './saga';
import { removeToken } from 'Containers/LoginContainer/actions';

export class CourseContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Helmet>
          <title>CourseContainer</title>
          <meta name="description" content="Description of CourseContainer" />
        </Helmet>
        <h2>Courses</h2>
        <button
          type="button"
          onClick={this.props.logout}
        >Logout
        </button>
      </div>
    );
  }
}

CourseContainer.propTypes = {
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  coursecontainer: makeSelectCourseContainer(),
});

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(removeToken()),
  };
}


const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'courseContainer', reducer });
const withSaga = injectSaga({ key: 'courseContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(CourseContainer);
