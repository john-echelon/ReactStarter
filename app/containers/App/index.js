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
import { Switch, Route, Link } from 'react-router-dom';
import HomePage from 'containers/HomePage/Loadable';
import LoginContainer from 'containers/LoginContainer/Loadable';
import CourseContainer from 'containers/CourseContainer/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import PrivateRoute from 'containers/App/AuthenticatedRoute';
import RedirectOnLoginRoute from 'containers/App/NotAuthenticatedRoute';

export default function App() {
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
