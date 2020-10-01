import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { ErrorPage1 } from "./ErrorPage1";
import { ErrorPage2 } from "./ErrorPage2";
import { ErrorPage3 } from "./ErrorPage3";
import { ErrorPage4 } from "./ErrorPage4";
import { ErrorPage5 } from "./ErrorPage5";
import { ErrorPage6 } from "./ErrorPage6";
import { URL_PREFIX } from "../../constants/defaultValues"

export default function ErrorsPage() {
  return (
      <Switch>
        <Redirect from={"/"+URL_PREFIX+"/error"} exact={true} to={"/"+URL_PREFIX+"/error/error-v1"} />
        <Route path={"/"+URL_PREFIX+"/error/error-v1"} component={ErrorPage1} />
        <Route path={"/"+URL_PREFIX+"/error/error-v2"} component={ErrorPage2} />
        <Route path={"/"+URL_PREFIX+"/error/error-v3"} component={ErrorPage3} />
        <Route path={"/"+URL_PREFIX+"/error/error-v4"} component={ErrorPage4} />
        <Route path={"/"+URL_PREFIX+"/error/error-v5"} component={ErrorPage5} />
        <Route path={"/"+URL_PREFIX+"/error/error-v6"} component={ErrorPage6} />
      </Switch>
  );
}
