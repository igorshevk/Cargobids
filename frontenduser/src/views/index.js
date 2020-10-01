import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { URL_PREFIX } from "../constants/defaultValues"

class Main extends Component {
  render() {
    return <Redirect to={"/"+URL_PREFIX+"/landing"} />
  }
}
export default Main;
