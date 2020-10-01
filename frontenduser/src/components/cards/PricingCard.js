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
import { getUser, PAYMENT_TYPES, PLAN_DURATIONS } from "../../helpers/API";
import { Route, withRouter, Switch, Redirect } from "react-router-dom";
import CheckoutForm from "./CheckoutForm";

class PricingCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // optionsList: [],
      // selectedOption:this.props.data['optionsList'][0].id,
      // select_plan_price:this.props.data['optionsList'][0].amount,
      // users: getUser(),
      pricesData: this.props.pricesData,
    };
  }

  setPaymentModal = (method, index, opt) => {
    let pricesData = this.state.pricesData;
    pricesData[index]["optionsList"][opt].selected_payment_type =
      PAYMENT_TYPES[method];
    this.setState({
      pricesData: pricesData,
    });
    // this.props.paymentModal({method:PAYMENT_TYPES[index].value, paymentDetail:paymentDetail})
  };

  handleSubscription = (paymentDetail, plan) => {
    if (plan.selected_payment_type === undefined)
      plan.selected_payment_type = { value: "Stripe", label: "Stripe" };
    this.props.paymentModal({
      method: plan.selected_payment_type.value,
      paymentDetail: paymentDetail,
      plan: plan,
    });
  };
  /*  changeSelectedOption = (e) => {
        this.setState({
            selectedOption: this.props.data['optionsList'][e.target.value].id,
            select_plan_price: this.props.data['optionsList'][e.target.value].amount,
        });
     }

    componentWillReceiveProps(nextProps) {
      if(!nextProps.isPayMethod)
        this.setState({selected_payment_type:{'value':'default', 'label':"Select Method"}})
    }*/

  render() {
    // const { users, select_plan_price } = this.state;
    const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);
    return (
      <div className="container">
        {this.state.pricesData.map((priceData, index) => {
          if (priceData.title === "Basic") {
            return (
              <div className="row pricing-row style-7" id="">
                <div className="col-sm-12">
                  <h1
                    className="style-no"
                    style={{
                      color: "#ff4500",
                      margin: "0 auto",
                    }}
                  >
                    ABBONAMENTO BASIC
                  </h1>
                </div>
                {this.state.pricesData[index].optionsList.map((plan, i) => {
                  let type = "starter";
                  if (i == 1) type = "business";
                  else if (i == 2) type = "premium";
                  return (
                    <div className="col-lg-4 col-md-6 pricing-col">
                      <div className={"pricing pricing-7 " + type}>
                        <p className="pricing-title">
                          <IntlMessages
                            id={
                              PLAN_DURATIONS[plan.name] === 1
                                ? "Month"
                                : "Months"
                            }
                          >
                            {(message) =>
                              PLAN_DURATIONS[plan.name] + " " + message
                            }
                          </IntlMessages>
                        </p>

                        <div className="price">
                          <div className="currency">&euro;</div>
                          <div className="num">{plan.amount}</div>
                        </div>
                        <ul className="specs">
                          {priceData.features.map((feature) => {
                            return (
                              <>
                                {feature != "" ? (
                                  <li>
                                    <span className="font-weight-bold">
                                      <span>&#10003;</span>
                                    </span>{" "}
                                    {feature}
                                  </li>
                                ) : (
                                  ""
                                )}
                              </>
                            );
                          })}
                        </ul>
                        <div className="">
                          <select
                            onChange={(e) =>
                              this.setPaymentModal(e.target.value, index, i)
                            }
                            className="form-control"
                            style={{ borderRadius: "5px" }}
                          >
                            {PAYMENT_TYPES.map((payment_type, key) => {
                              return (
                                <IntlMessages id={payment_type.label}>
                                  {(message) => (
                                    <option value={key}>{message}</option>
                                  )}
                                </IntlMessages>
                              );
                            })}
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={(e) =>
                            this.handleSubscription(priceData, plan)
                          }
                          className="btn-shadow btn-multiple-state btn btn-primary btn-lg"
                        >
                          <IntlMessages id="membership.Subscribe" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }
        })}
        <br />
        {this.state.pricesData.map((priceData, index) => {
          if (priceData.title === "Premium") {
            return (
              <div className="row pricing-row style-7" id="">
                <div className="col-sm-12">
                  <h1
                    className="style-no"
                    style={{ margin: "0 auto", color: "blue" }}
                  >
                    ABBONAMENTO PREMIUM
                  </h1>
                </div>
                {this.state.pricesData[index].optionsList.map((plan, i) => {
                  let type = "starter";
                  if (i == 1) type = "business";
                  else if (i == 2) type = "premium";
                  return (
                    <div className="col-lg-4 col-md-6 pricing-col">
                      <div className={"pricing pricing-7 " + type}>
                        <p className="pricing-title">
                          <IntlMessages
                            id={
                              PLAN_DURATIONS[plan.name] === 1
                                ? "Month"
                                : "Months"
                            }
                          >
                            {(message) =>
                              PLAN_DURATIONS[plan.name] + " " + message
                            }
                          </IntlMessages>
                        </p>

                        <div className="price">
                          <div className="currency">&euro;</div>
                          <div className="num">{plan.amount}</div>
                        </div>
                        <ul className="specs">
                          {priceData.features.map((feature) => {
                            return (
                              <>
                                {feature != "" ? (
                                  <li>
                                    <span className="font-weight-bold">
                                      <span>&#10003;</span>
                                    </span>{" "}
                                    {feature}
                                  </li>
                                ) : (
                                  ""
                                )}
                              </>
                            );
                          })}
                        </ul>
                        <div className="">
                          <select
                            onChange={(e) =>
                              this.setPaymentModal(e.target.value, index, i)
                            }
                            className="form-control"
                            style={{ borderRadius: "5px" }}
                          >
                            {PAYMENT_TYPES.map((payment_type, key) => {
                              return (
                                <IntlMessages id={payment_type.label}>
                                  {(message) => (
                                    <option value={key}>{message}</option>
                                  )}
                                </IntlMessages>
                              );
                            })}
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={(e) =>
                            this.handleSubscription(priceData, plan)
                          }
                          className="btn-shadow btn-multiple-state btn btn-primary btn-lg"
                        >
                          <IntlMessages id="membership.Subscribe" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }
        })}
      </div>
    );
  }
}
export default injectIntl(PricingCard);
