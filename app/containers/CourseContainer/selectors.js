import { createSelector } from 'reselect';

/**
 * Direct selector to the courseContainer state domain
 */
const selectCourseContainerDomain = state => state.get('courseContainer');

/**
 * Other specific selectors
 */


/**
 * Default selector used by CourseContainer
 */

const makeSelectCourseContainer = () => createSelector(
  selectCourseContainerDomain,
  substate => substate.toJS()
);

export default makeSelectCourseContainer;
export {
  selectCourseContainerDomain,
};
