import React from "react"
import { Redirect, Route, Switch } from "react-router-dom";
import UsersList from "./UsersList";
import UserEdit from "./Edit";
import UserCreate from "./Create";
import {URL_PREFIX} from "../../constants/defaultValues";

export default function UserPages(props) {
    return (
        <Switch>

            <Redirect
                exact={true}
                from={"/"+URL_PREFIX+"/users"}
                to={"/"+URL_PREFIX+"/users/list"}
            />

            <Route
                path={"/"+URL_PREFIX+"/users/list"}
                component={UsersList}
            />

            <Route
                path={"/"+URL_PREFIX+"/users/add"}
                component={UserCreate}
            />

            <Route
                path={"/"+URL_PREFIX+"/users/:user_id/edit"}
                component={UserEdit}
            />

        </Switch>
    );
}