import React from "react"
import { Redirect, Route, Switch } from "react-router-dom";
import SubscriberList from "./List"
import SubscriberEdit from "./Edit"
import SubscriberCreate from "./Create"
import {URL_PREFIX} from "../../constants/defaultValues";

export default function UserPages(props) {
    return (
        <Switch>

            <Redirect
                exact={true}
                from={"/"+URL_PREFIX+"/subscribers"}
                to={"/"+URL_PREFIX+"/subscribers/list"}
            />

            <Route
                path={"/"+URL_PREFIX+"/subscribers/list"}
                component={SubscriberList}
            />

            <Route
                path={"/"+URL_PREFIX+"/subscribers/add/:user_id"}
                component={SubscriberCreate}
            />

            <Route
                path={"/"+URL_PREFIX+"/subscribers/add"}
                component={SubscriberCreate}
            />

            <Route
                path={"/"+URL_PREFIX+"/subscribers/:subscriber_id/edit"}
                component={SubscriberEdit}
            />

        </Switch>
    );
}