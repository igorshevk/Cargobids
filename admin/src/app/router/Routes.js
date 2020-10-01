/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/pages/auth/AuthPage`, `src/pages/home/HomePage`).
 */

import React from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import {connect, shallowEqual, useSelector} from "react-redux";
import { useLastLocation } from "react-router-last-location";
import HomePage from "../pages/home/HomePage";
import ErrorsPage from "../pages/errors/ErrorsPage";
import LogoutPage from "../pages/auth/Logout";
import { LayoutContextProvider } from "../../_metronic";
import Layout from "../../_metronic/layout/Layout";
import * as routerHelpers from "../router/RouterHelpers";
import AuthPage from "../pages/auth/AuthPage";
import AuthSync from "../helpers/AuthSync";
import {LOGIN_URL} from "../constants/defaultValues";
import {hasValidAuthToken} from "../helpers/commons";

export const Routes = withRouter(({ history }) => {

    const lastLocation = useLastLocation();
    routerHelpers.saveLastLocation(lastLocation);
    const { isAuthorized, menuConfig, userLastLocation } = useSelector(
        ({ auth, urls, builder: { menuConfig } }) => ({
            menuConfig,
            isAuthorized: auth.user != null,
            userLastLocation: routerHelpers.getLastLocation()
        }),
        shallowEqual
    );

    const [extra_data, setExtraData] = React.useState(extra_data ? extra_data:{});

    return (
        /* Create `LayoutContext` from current `history` and `menuConfig`. */
        <LayoutContextProvider history={history} menuConfig={menuConfig}>
            <Switch>
                {(!isAuthorized && !hasValidAuthToken({history})) ? (
                    /* Render auth page when user at `/auth` and not authorized. */
                    <AuthPage extra_data={extra_data} setExtraData={setExtraData} />
                    // window.location.assign(LOGIN_URL);
                ) : (
                    /* Otherwise redirect to root page (`/`) */
                    <Redirect from="/admin/auth" to={userLastLocation} />
                )}

                <Route path="/admin/error" component={ErrorsPage} />
                <Route path="/admin/logout" component={LogoutPage} />

                {!isAuthorized ? (
                    /* Redirect to `/auth` when user is not authorized */
                    <Redirect to="/admin/auth/login" />
                ) : (
                    <Layout>
                        <HomePage userLastLocation={userLastLocation} />
                    </Layout>
                )}
            </Switch>
        </LayoutContextProvider>
    );
});
