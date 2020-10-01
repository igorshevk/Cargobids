import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import UserLayout from '../../layout/UserLayout';
const Second = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './second')
);
const Login = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './login')
);
const Register = React.lazy(() =>
  import(/* webpackChunkName: "register" */ './register')
);
const CompleteRegister = React.lazy(() =>
  import(/* webpackChunkName: "register-complete" */ './register-complete')
);
const ForgotPassword = React.lazy(() =>
  import(/* webpackChunkName: "user-forgot-password" */ './forgot-password')
);
const PasswordReset = React.lazy(() =>
  import(/* webpackChunkName: "user-forgot-password" */ './password-reset')
);

const ActivateTrial = React.lazy(() =>
  import(/* webpackChunkName: "user-forgot-password" */ './activate-trial')
);


function SecondMenu(mainProps){

    console.log('match is ')
    console.log(mainProps);
    let match = mainProps.match;
    return (
      <UserLayout>
      <Suspense fallback={<div className="loading" />}>
        <Switch>
          <Redirect exact from={`${match.url}/`} to={`${match.url}/second`} />
          <Route
            path={`${match.url}/second`}
            render={props => <Second {...props} />}
          />
          <Route
            path={`${match.url}/login`}
            render={props => <Login {...props} extra_data={mainProps.extra_data} setExtraData={mainProps.setExtraData} />}
          />
          <Route
            path={`${match.url}/register`}
            render={props => <Register {...props} />}
          />
          <Route
            path={`${match.url}/complete`}
            render={props => <CompleteRegister {...props} />}
          />
          <Route
            path={`${match.url}/forgot-password`}
            render={props => <ForgotPassword {...props} />}
          />
          <Route
            path={`${match.url}/password-reset`}
            render={props => <PasswordReset {...props} />}
          />
          <Redirect to="/error" />
        </Switch>
      </Suspense>
      </UserLayout>
    )
};
export default SecondMenu;
