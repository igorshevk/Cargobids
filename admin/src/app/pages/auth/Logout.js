import React, { Component } from "react";
import * as auth from "../../store/ducks/auth.duck";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { LayoutSplashScreen } from "../../../_metronic";
import {LOGIN_URL, REACT_APP_URL_USER} from "../../constants/defaultValues";
import {forgotLastLocation} from "../../router/RouterHelpers";
import {logout,logoutUser as lgOutUsr} from "../../crud/auth.crud";
import {AUTH_COOKIE_NAME, AUTH_TOKEN_KEY, URL_PREFIX} from '../../constants/defaultValues';
import Cookies from "universal-cookie";

class Logout extends Component {
  componentDidMount() {
      this.logoutUser();
  }


  async logoutUser() {
    await lgOutUsr();
    this.props.logout();
    // forgotLastLocation();
  }

  render() {
    const { hasAuthToken } = this.props;

    console.log('hasAuthToken',hasAuthToken);
    // return window.location.assign(LOGIN_URL);
    return hasAuthToken ? <LayoutSplashScreen /> : <Redirect to={"/"+URL_PREFIX+"/auth"} />;
  }
}

export default connect(
  ({ auth }) => ({ hasAuthToken: Boolean(auth.authToken) }),
  auth.actions
)(Logout);
