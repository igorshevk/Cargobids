import React, { Component, Suspense } from "react";
import { connect } from "react-redux";
import {
  BrowserRouter as Router,withRouter,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { IntlProvider } from "react-intl";
import AppLocale from "./lang";
import ColorSwitcher from "./components/common/ColorSwitcher";
import NotificationContainer from "./components/common/react-notifications/NotificationContainer";
import { isMultiColorActive, isDemo, URL_PREFIX } from "./constants/defaultValues";
import { getDirection } from "./helpers/Utils";
import {isLoggedIn, updateUser, getUser, isAgent, isAirline} from './helpers/API';
import api from "./services/api";
import { getConfig } from "./helpers/API";
import { API_URL } from "./helpers/Auth";
import $ from "jquery";
import { signOut } from "./helpers/Auth";
import { errorNoti, successNoti } from "./helpers/Notifications";
import { PusherContext } from "./context";
import Pusher from 'pusher-js';


const ViewMain = React.lazy(() =>
  import(/* webpackChunkName: "views" */ "./views")
);
const Landing = React.lazy(() =>
  import(/* webpackChunkName: "views" */ "./views/landing/start")
);

const ViewAgent = React.lazy(() =>
  import(/* webpackChunkName: "views-app" */ "./views/agent")
);
const ViewAirline = React.lazy(() =>
  import(/* webpackChunkName: "views-app" */ "./views/airline")
);
const ViewAccount = React.lazy(() =>
  import(/* webpackChunkName: "views-user" */ "./views/account")
);
const ViewError = React.lazy(() =>
  import(/* webpackChunkName: "views-error" */ "./views/error")
);

const AuthRoute = ({ component: Component, authUser, ...rest }) => {
  return (
      <Route
          {...rest}
          render={props =>
              isLoggedIn() ? (
                  <Component {...props} />
              ) : (
                  <Redirect
                      to={{
                        pathname: '/'+URL_PREFIX+'/user/login',
                        state: { from: props.location }
                      }}
                  />
              )
          }
      />
  );
};
const AgentRoute = ({ component: Component, authUser, ...rest }) => {
  // if the is a reply to a question path 
  // store this url in the localSotrag 
  // to redirect the user to this page when he logges in
  let url = window.location.href;
  let replyUrl = url.includes("/agent/quotes/reply?id");
  let redirect = localStorage.getItem("redirect");
  if (!isLoggedIn() && replyUrl && !redirect) {
    localStorage.setItem("redirect" , url);
  } 
  // else if (isLoggedIn() && redirect ) {
  //   window.location.href = redirect;
  // }
  return (
      <Route
          {...rest}
          render={props =>
              isLoggedIn() && (isAgent() || isAirline()) ? (
                  <Component {...props} />
              ) : (
                  <Redirect
                      to={{
                        pathname: '/'+URL_PREFIX+'/user/login',
                        state: { from: props.location }
                      }}
                  />
              )
          }
      />
  );
};

const AirlineRoute = ({ component: Component, authUser, ...rest }) => {

  return (

      <Route
          {...rest}
          render={props =>
              isLoggedIn() && isAirline() ? (
                  <Component {...props} />
              ) : (
                  <Redirect
                      to={{
                        pathname: '/'+URL_PREFIX+'/user/login',
                        state: { from: props.location }
                      }}
                  />
              )
          }
      />
  );
};

//Global Defined
window.authKey = "persist:cargobid-auth";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pusher : null
    }
    const direction = getDirection();
    if (direction.isRtl) {
      document.body.classList.add("rtl");
      document.body.classList.remove("ltr");
    } else {
      document.body.classList.add("ltr");
      document.body.classList.remove("rtl");
    }
    if(isLoggedIn())
      updateUser(props);
  }

  componentDidMount = () => {
    /************ create the pusher instance  ***********/
    const pusherKey = process.env.PUSHER_KEY;
    const cluster = process.env.CLUSTER;
    const pusher = new Pusher(pusherKey, {
      cluster: cluster,
    });

    this.setState({"pusher" : pusher});


    /************ Detect when user close browser tab and log him out ***************/
    // window.addEventListener("beforeunload", function (event) {
    //   const token = getConfig(true).slice(0,8);
    //   let formData = new FormData();
    //   formData.append("token", token);
    //   if("sendBeacon" in navigator)
    //   {
    //     navigator.sendBeacon(API_URL + "close-browser",formData );
    //   }
    //   else
    //   {
    //       var client = new XMLHttpRequest();
    //       client.open("POST", API_URL + "close-browser", false);
    //       client.send(formData);
    //   }
    //   return;
    // });

    let userActivityTimeout = null;
    let logout = null;
    const EXPIRY_TOKEN = parseInt(process.env.EXPIRY_TOKEN)
    const timeoutForInactiveUser = (EXPIRY_TOKEN-1)*60*1000
    function resetUserActivityTimeout() {
      clearTimeout(userActivityTimeout);
      clearTimeout(logout);
      userActivityTimeout = setTimeout(() => {
        inactiveUserAction();
      }, timeoutForInactiveUser); 
    }

    function inactiveUserAction() {
      if (isLoggedIn()){
        errorNoti("if you stay inactive for more than 5sec you will be logged out automatically");
        logout = setTimeout(() => {
          signOut();
          if (
          window.location.pathname !== "/cb/landing" &&
          window.location.pathname !== "/cb/account/login" &&
          window.location.pathname !== "/cb/account/register" ){
            window.location.href = "/cb/landing";
          }
        }, 5000);
      }
    }
  
    function activateActivityTracker() {
      window.addEventListener("mousemove", resetUserActivityTimeout);
      window.addEventListener("scroll", resetUserActivityTimeout);
      window.addEventListener("keydown", resetUserActivityTimeout);
      window.addEventListener("resize", resetUserActivityTimeout);
    }
    activateActivityTracker()

  }

  componentWillUnmount = () => {
    /************ Open a Pusher  */

    /************ Detect when user close browser tab and log him out ***************/
    // window.removeEventListener("beforeunload", function (event) {
    //   const token = getConfig(true).slice(0,8);
    //   let formData = new FormData();
    //   formData.append("token", token);
    //   if("sendBeacon" in navigator)
    //   {
    //     navigator.sendBeacon(API_URL + "close-browser",formData );
    //   }
    //   else
    //   {
    //       var client = new XMLHttpRequest();
    //       client.open("POST", API_URL + "close-browser", false);
    //       client.send(formData);
    //   }
    //   return;
    // });

    window.addEventListener("mousemove", () => null);
    window.addEventListener("scroll", () => null);
    window.addEventListener("keydown", () => null);
    window.addEventListener("resize", () => null);
  }
  
  render() {
    const { locale, loginUser } = this.props;
    const currentAppLocale = AppLocale[locale];
    return (
      <div className="h-100">
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <PusherContext.Provider value={this.state.pusher}>
            <React.Fragment>
              <NotificationContainer />
              {isMultiColorActive && <ColorSwitcher />}
              <Suspense fallback={<div className="loading" />}>
                <Router>
                  <Switch>
                    <AuthRoute
                      path={'/'+URL_PREFIX+"/app"}
                      authUser={loginUser}
                      component={Landing}
                    />
                    {/* <Redirect exact from={`/`} to={`/landing`} /> */}
                    <Route
                      path={'/'+URL_PREFIX+"/landing/trial/:trial_key"}
                      render={props => <Landing {...props} />}
                    />
                    <Route
                      path={'/'+URL_PREFIX+"/landing"}
                      render={props => <Landing {...props} />}
                    />
                    <AgentRoute
                      path={'/'+URL_PREFIX+"/agent"}
                      authUser={loginUser}
                      component={ViewAgent}
                    />
                    <AirlineRoute
                      path={'/'+URL_PREFIX+"/airline"}
                      authUser={loginUser}
                      component={ViewAirline}
                    />
                    <Route
                      path={'/'+URL_PREFIX+"/account"}
                      render={props => <ViewAccount {...props} />}
                    />
                    <Route
                      path={'/'+URL_PREFIX+"/error"}
                      exact
                      render={props => <ViewError {...props} />}
                    />
                    <Route
                      path={'/'+URL_PREFIX+"/"}
                      exact
                      render={props => <ViewMain {...props} />}
                    />
                    <Redirect to={'/'+URL_PREFIX+"/landing"} />
                  </Switch>
                </Router>
              </Suspense>
            </React.Fragment>
          </PusherContext.Provider>
        </IntlProvider>
      </div>
    );
  }
}

const mapStateToProps = ({ authUser, settings }) => {
  const { user: loginUser } = authUser;
  const { locale } = settings;
  return { loginUser, locale };
};
const mapActionsToProps = {};

export default connect(mapStateToProps, mapActionsToProps)(withRouter(App));
