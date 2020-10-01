import React, {useEffect} from "react";
import { Link, Switch, Route, Redirect } from "react-router-dom";
import { toAbsoluteUrl } from "../../../_metronic";
import "../../../_metronic/_assets/sass/pages/login/login-1.scss";
import Login from "./Login";
import Registration from "./Registration";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import {LOGIN_URL, URL_PREFIX} from "../../constants/defaultValues";
import TwoFactorAuth from "./TwoFactorAuth";

export default function AuthPage(props) {
    let extra_data = props.extra_data;
    props.setExtraData(extra_data);

  return (
      <>
        <div className="kt-grid kt-grid--ver kt-grid--root">
          <div
              id="kt_login"
              className="kt-grid kt-grid--hor kt-grid--root kt-login kt-login--v1"
          >
            <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--desktop kt-grid--ver-desktop kt-grid--hor-tablet-and-mobile">
              <div
                  className="kt-grid__item kt-grid__item--order-tablet-and-mobile-2 kt-grid kt-grid--hor kt-login__aside"
                  style={{
                    backgroundImage: `url("/static/media/bg/bg-1.jpg")`
                  }}
              >
                <div className="kt-grid__item">
                  <Link to="/" className="kt-login__logo">
                    <img
                        alt="Logo"
                        src="/static/media/logos/logo-4.png"
                    />
                  </Link>
                </div>
                <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver">
                  <div className="kt-grid__item kt-grid__item--middle">
                    <h3 className="kt-login__title">Welcome to CargoBids!</h3>
                    <h4 className="kt-login__subtitle">
                      ADMIN DASHBOARD
                    </h4>
                  </div>
                </div>
                <div className="kt-grid__item">
                  <div className="kt-login__info">
                    <div className="kt-login__copyright">
                      &copy; 2018 Metronic
                    </div>
                    <div className="kt-login__menu">
                      <Link to="/terms" className="kt-link">
                        Privacy
                      </Link>
                      <Link to="/terms" className="kt-link">
                        Legal
                      </Link>
                      <Link to="/terms" className="kt-link">
                        Contact
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="kt-grid__item kt-grid__item--fluid  kt-grid__item--order-tablet-and-mobile-1  kt-login__wrapper">
                <Switch>
                  <Route path={"/"+URL_PREFIX+"/auth/login"} render={(routeProps) => { return <Login {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} />}} />
                  <Route path={"/"+URL_PREFIX+"/auth/registration"} component={Registration} />
                  <Route path={"/"+URL_PREFIX+"/auth/2FA"} render={(routeProps) => { return <TwoFactorAuth {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} />}} />
                  <Route path={"/"+URL_PREFIX+"/auth/forgot-password"} component={ForgotPassword} />
                  <Route path={"/"+URL_PREFIX+"/auth/password-reset/:key"}  component={ResetPassword} />
                  <Redirect from={"/"+URL_PREFIX+"/auth"} exact={true} to={"/"+URL_PREFIX+"/auth/login"} />
                  <Redirect to={"/"+URL_PREFIX+"/auth/login"} />
                </Switch>
              </div>
            </div>
          </div>
        </div>
      </>
  );
}
