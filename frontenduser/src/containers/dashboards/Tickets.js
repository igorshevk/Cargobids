import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Card, CardBody, CardTitle } from "reactstrap";

import api from "../../services/api";
import {getDateWithFormat} from '../../helpers/Utils';
import IntlMessages from "../../helpers/IntlMessages";


class Subscriptions extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      subscriptions : []
    }

    this.getSubscriptionHistory()
  }

  getSubscriptionHistory = () => {
    api.subscriptions('',(err, response)=>{
        this.setState({subscriptions:response.results})
    })
  } 

  render () {
    const {subscriptions} = this.state;
    return (
      <Card>
        <CardBody>
          <CardTitle>
            Subscriptions details
          </CardTitle>
          <div className="dashboard-list-with-user">
            <PerfectScrollbar
              options={{ suppressScrollX: true, wheelPropagation: false }}
            >
            {subscriptions.map((subscription, i) => {
              return <div className="d-flex flex-row mb-3 pb-3 border-bottom">

                    <div className="pl-3 pr-2">
                      <NavLink to="/app/pages/details">
                        <p className="font-weight-medium mb-0 ">Plan: {subscription.membership ? subscription.membership.name : ''}</p>
                        <p className="text-muted mb-0 text-small">
                          Subscribed for {subscription.interval_count} {subscription.interval} plan from {getDateWithFormat(new Date(subscription.created_at))} to {getDateWithFormat(new Date(subscription.cancel_at))}
                        </p>
                      </NavLink>
                    </div>
                  </div>
            })}
                  
            </PerfectScrollbar>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default Subscriptions;
