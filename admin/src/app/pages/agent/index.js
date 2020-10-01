import React from "react"
import { Redirect, Route, Switch } from "react-router-dom";
import AgentsList from "./AgentsList";
import AgentEdit from "./Edit";
import AgentCreate from "./Create";
import {URL_PREFIX} from "../../constants/defaultValues";


export default function UserPages(props) {
    return (
        <Switch>

            <Redirect
                exact={true}
                from={"/"+URL_PREFIX+"/agents"}
                to={"/"+URL_PREFIX+"/agents/list"}
            />

            <Route
                path={"/"+URL_PREFIX+"/agents/list"}
                component={AgentsList}
            />

            <Route
                path={"/"+URL_PREFIX+"/agents/add"}
                component={AgentCreate}
            />

            <Route
                path={"/"+URL_PREFIX+"/agents/:agent_id/edit"}
                component={AgentEdit}
            />

        </Switch>
    );
}