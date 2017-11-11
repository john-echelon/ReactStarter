
import { fromJS } from 'immutable';
import courseContainerReducer from '../reducer';

describe('courseContainerReducer', () => {
  it('returns the initial state', () => {
    expect(courseContainerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
