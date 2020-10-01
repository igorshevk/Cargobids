import React, { Component } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { NavLink } from "react-router-dom";
import { injectIntl } from "react-intl";
import {
  CustomInput,
  Input,
  Button,
  Card,
  CardBody,
  Label,
  FormGroup,
} from "reactstrap";
import Select from "react-select";
import CustomSelectInput from "../../components/common/CustomSelectInput";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";
import api from "../../services/api";
import { successNoti, errorNoti } from "../../helpers/Notifications";
import { getUser, PAYMENT_TYPES } from "../../helpers/API";
import { Route, withRouter, Switch, Redirect } from "react-router-dom";
import CheckoutForm from "./CheckoutForm";

class PriceCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      optionsList: [],
      selectedOption: this.props.data["optionsList"][0].id,
      select_plan_price: this.props.data["optionsList"][0].amount,
      users: getUser(),
      selected_payment_type: { value: "default", label: "Select Method" },
    };
  }
  changeSelectedOption = (e) => {
    this.setState({
      selectedOption: this.props.data["optionsList"][e.target.value].id,
      select_plan_price: this.props.data["optionsList"][e.target.value].amount,
    });
  };

  setPaymentModal = (e) => {
    this.setState({ selected_payment_type: e });
    this.props.paymentModal({
      method: e.value,
      paymentDetail: this.props.data,
    });
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isPayMethod)
      this.setState({
        selected_payment_type: { value: "default", label: "Select Method" },
      });
  }

  render() {
    const { optionsList } = this.props.data;

    const { users, select_plan_price } = this.state;
    const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);
    return (
      <Card>
        <CardBody className="pt-5 pb-5 d-flex flex-lg-column flex-md-row flex-sm-row flex-column">
          <div className="price-top-part">
            <i className={"large-icon " + this.props.data.icon}></i>
            <h5 className="mb-0 font-weight-semibold color-theme-1 mb-4">
              {this.props.data.title}
            </h5>
            <p className="text-large mb-2 text-default">
              {"$" + select_plan_price}
            </p>
            <p className="text-muted text-small">{this.props.data.detail}</p>
          </div>
          <div className="pl-3 pr-3 pt-3 pb-0 d-flex price-feature-list flex-column flex-grow-1">
            <ul className="list-unstyled">
              {this.props.data.features.map((feature, index) => {
                return (
                  <li key={index}>
                    <p className="mb-0">
                      {feature !== "" ? <span>&#10003;</span> : ""}
                      {feature !== "" ? " " + feature : <br />}
                    </p>
                  </li>
                );
              })}
            </ul>
            <FormGroup row>
              <div className="col-sm-12 text-center">
                <h4>ABBONATI ORA!</h4>
              </div>
              <div className="col-sm-12 col-md-6 offset-md-3">
                <Select
                  className="react-select border-dark"
                  classNamePrefix="react-select"
                  name="form-field-name"
                  placeholder="Payment Type"
                  onChange={(e) => this.setPaymentModal(e)}
                  options={PAYMENT_TYPES}
                  value={
                    this.state.selected_payment_type
                      ? this.state.selected_payment_type
                      : ""
                  }
                />
              </div>
            </FormGroup>
          </div>

          {this.state.selected_payment_type.value === "Bank Transfer" ? (
            <div className="row text-center">
              <div className="col-sm-12">
                <hr />
                DESTINATARIO BONIFICO: Cargobids
                <br />
                INDIRIZZO: <br />
                IBAN: <br />
                CAUSALE: Sottoscrizione Abbonamento {this.props.data.title}.
                <br />
                Once payment done please send bank transfer
              </div>
              <div className="col-sm-12">
                <br />
                <a
                  className="btn btn-primary btn-sm text-white"
                  onClick={this.props.toggle}
                >
                  Send Bank Transfer
                </a>
              </div>
            </div>
          ) : (
            <></>
          )}
        </CardBody>
      </Card>
    );
  }
}
export default injectIntl(PriceCard);
