import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Builder from "./Builder";
import Dashboard from "./Dashboard";
import DocsPage from "./docs/DocsPage";
import { LayoutSplashScreen } from "../../../_metronic";
import {URL_PREFIX} from "../../constants/defaultValues";

//Users List
import UsersList from "../User/UsersList";

// const GoogleMaterialPage = lazy(() =>
//   import("./google-material/GoogleMaterialPage")
// );
const ReactBootstrapPage = lazy(() =>
  import("./react-bootstrap/ReactBootstrapPage")
);

const UserPages = lazy(() =>
    import("../User/index")
);

const SubscriberPages = lazy(() =>
    import("../subscriber/index")
);

const AgentPages = lazy(() =>
    import("../agent/index")
);

const AirlinePages = lazy(() =>
    import("../airline/index")
);


export default function HomePage() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/admin" to="/admin/dashboard" />
        }
        <Route path={"/"+URL_PREFIX+"/builder"} component={Builder} />
        <Route path={"/"+URL_PREFIX+"/dashboard"} component={Dashboard} />
        <Route path={"/"+URL_PREFIX+"/agents"} component={AgentPages} />
        <Route path={"/"+URL_PREFIX+"/airlines"} component={AirlinePages} />
        {/*<Route path="/google-material" component={GoogleMaterialPage} />*/}

        {/*Custom Routes Start*/}
        {/* <Route path="/users/list" component={UsersList} />*/}

        {/*Users Routes*/}
        <Route path={"/"+URL_PREFIX+"/users"} component={UserPages} />
        <Route path={"/"+URL_PREFIX+"/subscribers"} component={SubscriberPages} />
        {/*Customer Routes End*/}
        <Route path={"/"+URL_PREFIX+"/react-bootstrap"} component={ReactBootstrapPage} />
        <Route path={"/"+URL_PREFIX+"/docs"} component={DocsPage} />
        <Redirect to={"/"+URL_PREFIX+"/error/error-v1"} />
      </Switch>
    </Suspense>
  );
}
