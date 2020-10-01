import React from "react"
import { Redirect, Route, Switch } from "react-router-dom";
import AirlinesList from "./AirlinesList";
import AirlineEdit from "./Edit";
import AirlineCreate from "./Create";
import {URL_PREFIX} from "../../constants/defaultValues"


export default function UserPages(props) {
    return (
        <Switch>

            <Redirect
                exact={true}
                from={"/"+URL_PREFIX+"/airlines"}
                to={"/"+URL_PREFIX+"/airlines/list"}
            />

            <Route
                path={"/"+URL_PREFIX+"/airlines/list"}
                component={AirlinesList}
            />

            <Route
                path={"/"+URL_PREFIX+"/airlines/add"}
                component={AirlineCreate}
            />

            <Route
                path={"/"+URL_PREFIX+"/airlines/:airline_id/edit"}
                component={AirlineEdit}
            />

        </Switch>
    );
}