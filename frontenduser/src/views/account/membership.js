import React, { Component, Fragment } from "react";
import {
  Row,
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  FormGroup,
  Tooltip,
  Label,
  CustomInput,
  FormText,
  Form,
} from "reactstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import { Separator, Colxx } from "../../components/common/CustomBootstrap";
//import { pricesData } from "../../data/prices";
import PriceCard from "../../components/cards/PriceCard";
import PricingCard from "../../components/cards/PricingCard";
import IntlMessages from "../../helpers/IntlMessages";
import { injectIntl } from "react-intl";
import { defaultLocale } from "../../constants/defaultValues";
import api from "../../services/api";
import {
  getUser,
  isAgent,
  isAirline,
  setLocalStorageUser,
  isSubscribed,
  PLAN_IDS,
  PLAN_DURATIONS,
  isShowWelcome,
} from "../../helpers/API";
import CheckoutForm from "../../components/cards/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { successNoti, errorNoti, infoNoti } from "../../helpers/Notifications";
import { sendError } from "../../helpers/Utils";
import "../../assets/css/pricing/style.css";
import { URL_PREFIX } from "../../constants/defaultValues";

const locale = localStorage.getItem("currentLanguage") || defaultLocale;
class Prices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pricesData: {},
      paymentModal: false,
      paymentDetail: {},
      selected_plan: { optionsList: [] },
      type: "",
      loader: "hidden",
      user: {},
      subscription: { invoice_sent_on: moment() },
      selectedOption: {},
      isPayMethod: true,
      sending: false,
    };
  }

  componentDidMount() {
    if (isSubscribed()) {
      if (!isShowWelcome()) {
        if (isAgent())
          this.props.history.push("/" + URL_PREFIX + "/agent/dashboard");
        else this.props.history.push("/" + URL_PREFIX + "/airline/dashboard");
      } else if (isShowWelcome()) {
        if (isAgent())
          this.props.history.push("/" + URL_PREFIX + "/agent/welcome");
        else this.props.history.push("/" + URL_PREFIX + "/airline/welcome");
      }
    }
  }

  paymentModal = (paymentOptions) => {
    let subscription = this.state.subscription;
    subscription.payment_type = paymentOptions["method"];
    subscription.membership = PLAN_IDS[paymentOptions["paymentDetail"].title];
    let duration = PLAN_DURATIONS[paymentOptions["plan"].name];
    let statesToUpdate = {
      subscription: subscription,
      selected_plan: paymentOptions["paymentDetail"],
      isPayMethod: true,
      selectedOption: {
        label: (
          <IntlMessages id={duration === 1 ? "Month" : "Months"}>
            {(message) => duration + " " + message}
          </IntlMessages>
        ),
        value: paymentOptions["plan"].id,
      },
      selected_plan_price: paymentOptions["plan"].amount,
    };
    // if(subscription.payment_type == 'Stripe')
    statesToUpdate["paymentModal"] = true;
    this.setState(statesToUpdate);
    console.log(statesToUpdate);
  };

  toggle = () => {
    this.setState(
      (prevState) => ({
        paymentModal: !prevState.paymentModal,
      }),
      () => {
        this.setState({ isPayMethod: this.state.paymentModal });
      }
    );
  };

  changeSelectedOption = (value) => {
    this.setState({ selectedOption: value });
    if (this.state.selected_plan.optionsList.length) {
      this.state.selected_plan.optionsList.map((item, i) => {
        if (item.id === value.value)
          this.setState({ selected_plan_price: item.amount });
      });
    }
  };

  componentDidMount() {
    const { BasicPlans } = "";
    const { PremiumPlans } = "";
    this.setState({ user: getUser() });

    api.plansList("", (err, response) => {
      if (response) {
        response.map((dt, i) => {
          if (dt.product === process.env.STRIPE_BASIC_PLAN_ID) {
            response[i]["features"] = [
              "Pannello di Controllo Personale",
              "Notifiche degli Aggiornamenti",
              "Un mese di prova gratuito alla prima sottoscrizione",
              "",
            ];
            response[i]["title"] = "Basic";
          } else if (dt.product === process.env.STRIPE_PREMIUM_PLAN_ID) {
            response[i]["features"] = [
              "Instant Messaging Agente -> Vettore",
              "Pannello di Controllo Personale",
              "Notifiche degli Aggiornamenti",
              "Un mese di prova gratuito alla prima sottoscrizione",
            ];
            response[i]["title"] = "Premium";
          }
        });
        this.setState({ pricesData: response });
      } else {
        console.log(err);
      }
    });
  }

  dateHandler(value, key) {
    console.log(value);
    let subscription = this.state.subscription;
    subscription[key] = value;
    this.setState({ subscription: subscription });
  }

  sendBankTransfer = () => {
    if (!this.state.sending) {
      this.setState({ sending: true });
      let subscription = this.state.subscription;
      console.log(this.state.selectedOption);
      subscription.interval_count = this.state.selectedOption.label
        ? PLAN_DURATIONS[this.state.selectedOption.label]
        : 1;
      if (this.state.user.last_subscription != null) {
        api.patch(
          "subscriptions/" + this.state.user.last_subscription + "/",
          subscription,
          (error, response) => {
            if ("id" in response) {
              successNoti(
                "Il modulo di sottoscrizione é stato inviato. Riceverai una conferma appena possibile.Grazie"
              );
              this.toggle();
            } else {
              let errors = sendError(response);
              let errHtml = errors.map((err, i) => {
                return (
                  <div key={i}>
                    {err}
                    <br />
                  </div>
                );
              });
              errorNoti(<div>{errHtml}</div>);
            }
          }
        );
      } else {
        api.post("subscriptions", subscription, (response) => {
          if ("id" in response) {
            successNoti("Subscription request has been send!");
            this.toggle();
          } else {
            let errors = sendError(response);
            let errHtml = errors.map((err, i) => {
              return (
                <div key={i}>
                  {err}
                  <br />
                </div>
              );
            });
            errorNoti(<div>{errHtml}</div>);
          }
        });
      }
    }
  };

  render() {
    const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);
    const { pricesData } = this.state;
    let optionsLists = [];

    if (this.state.selected_plan.optionsList.length) {
      optionsLists = this.state.selected_plan.optionsList.map((item, i) => {
        item["label"] = (
          <IntlMessages
            id={PLAN_DURATIONS[item["name"]] === 1 ? "Month" : "Months"}
          >
            {(message) => PLAN_DURATIONS[item["name"]] + " " + message}
          </IntlMessages>
        );
        item["value"] = item["id"];

        return item;
      });
    }
    console.log(optionsLists);
    console.log(this.state.selectedOption);
    const { subscription } = this.state;

    return (
      <Fragment>
        <Row className="hidden">
          <Colxx xxs="12">
            <Breadcrumb heading="menu.prices" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row className="equal-height-container mb-5">
          {pricesData.length ? (
            <PricingCard
              pricesData={pricesData}
              history={this.props.history}
              paymentModal={this.paymentModal}
              toggle={this.toggle}
              isPayMethod={this.state.isPayMethod}
            />
          ) : (
            ""
          )}
        </Row>
        <Modal
          isOpen={this.state.paymentModal}
          toggle={this.toggle}
          size={
            this.state.subscription.payment_type === "Bank Transfer"
              ? "lg"
              : "md"
          }
        >
          <ModalHeader toggle={this.toggle}>
            Piano Tariffario {this.state.selected_plan.title} : Sottoscrivi e
            paga con <IntlMessages id={this.state.subscription.payment_type} />
          </ModalHeader>
          <ModalBody>
            <div className={"cus_loader " + this.state.loader}></div>

            {this.state.subscription.payment_type === "Bank Transfer" ? (
              <Form>
                <Row>
                  <div className="col-sm-12">
                    DESTINATARIO BONIFICO: Cargobids
                    <br />
                    INDIRIZZO: <br />
                    IBAN:
                    <br />
                    CAUSALE: Sottoscrizione Abbonamento{" "}
                    {this.state.selectedOption.label}{" "}
                    {this.state.selected_plan.title} <br />
                    <br />
                    Una volta effettuato il Bonifico Bancario, compilare
                    dettagliatamente ed inviare il seguente Form:
                    <hr />
                  </div>
                  <Colxx sm="6">
                    <FormGroup row>
                      <Label for="emailHorizontal" lg={4} sm={2}>
                        NOME:
                      </Label>
                      <Colxx sm={10} lg={8}>
                        <Input
                          type="text"
                          name="title"
                          readOnly={true}
                          value={
                            this.state.user
                              ? this.state.user.firstname +
                                " " +
                                this.state.user.lastname
                              : ""
                          }
                          className="border-dark"
                        />
                      </Colxx>
                    </FormGroup>
                  </Colxx>
                  <Colxx sm="6">
                    <FormGroup row>
                      <Label for="emailHorizontal" lg={4} sm={2}>
                        {" "}
                        AZIENDA:{" "}
                      </Label>
                      <Colxx sm={10} lg={8}>
                        <Input
                          type="text"
                          name="title"
                          readOnly={true}
                          value={
                            this.state.user && isAgent()
                              ? this.state.user.agent_company.agent_company_name
                              : this.state.user && isAirline()
                              ? this.state.user.airline_company
                                  .airline_company_name
                              : ""
                          }
                          className="border-dark"
                        />
                      </Colxx>
                    </FormGroup>
                  </Colxx>
                  <Colxx sm="6">
                    <FormGroup row>
                      <Label for="emailHorizontal" sm={2} lg={4}>
                        PERIODO:
                      </Label>
                      <Colxx sm={10} lg={8}>
                        <Select
                          className="react-select border-dark"
                          classNamePrefix="react-select"
                          name="period"
                          value={this.state.selectedOption}
                          onChange={(e) => this.changeSelectedOption(e)}
                          options={optionsLists}
                          placeholder="Select Period"
                        />
                      </Colxx>
                    </FormGroup>
                  </Colxx>
                  <Colxx sm="6">
                    <FormGroup row>
                      <Label for="emailHorizontal" sm={2} lg={4}>
                        Importo:
                      </Label>
                      <Colxx sm={10} lg={8}>
                        <Input
                          type="text"
                          name="title"
                          readOnly={true}
                          value={
                            this.state.selected_plan_price
                              ? "€" + this.state.selected_plan_price
                              : optionsLists.length
                              ? optionsLists[0].amount
                              : ""
                          }
                          className="border-dark"
                          placeholder="Pricing"
                        />
                      </Colxx>
                    </FormGroup>
                  </Colxx>
                  <Colxx sm="6">
                    <FormGroup row>
                      <Label for="emailHorizontal" sm={2} lg={4}>
                        {" "}
                        Bonifico Bancario effettuato il:{" "}
                      </Label>
                      <Colxx sm={10} lg={8}>
                        <DatePicker
                          className="border-dark"
                          dateFormat="DD-MM-YYYY"
                          selected={
                            subscription
                              ? moment(subscription.invoice_sent_on)
                              : null
                          }
                          onChange={(v) =>
                            this.dateHandler(v, "invoice_sent_on")
                          }
                        />
                      </Colxx>
                    </FormGroup>
                  </Colxx>
                  <Colxx sm="6">
                    <FormGroup row>
                      <Label for="emailHorizontal" sm={2} lg={4}>
                        {" "}
                        Dettagli (C.R.O):{" "}
                      </Label>
                      <Colxx sm={10} lg={8}>
                        <Input
                          type="text"
                          name="title"
                          value={
                            subscription ? subscription.bank_transfer_no : null
                          }
                          className="border-dark"
                          onChange={(e) => {
                            let subscription = this.state.subscription;
                            subscription.bank_transfer_no = e.target.value;
                            this.setState({ subscription: subscription });
                          }}
                        />
                      </Colxx>
                    </FormGroup>
                  </Colxx>
                </Row>
              </Form>
            ) : (
              <>
                <Row>
                  <Colxx sm="8">
                    <Select
                      className="react-select border-dark"
                      classNamePrefix="react-select"
                      name="form-field-name"
                      onChange={(e) => this.changeSelectedOption(e)}
                      options={optionsLists}
                      placeholder="Select Period"
                      value={this.state.selectedOption}
                    />
                  </Colxx>
                  <Colxx sm="4">
                    <Input
                      type="text"
                      name="title"
                      readOnly={true}
                      value={
                        this.state.selected_plan_price
                          ? "€" + this.state.selected_plan_price
                          : ""
                      }
                      className="border-dark"
                      placeholder="Pricing"
                    />
                  </Colxx>
                </Row>
                <div className="membershippage">
                  <div className="text-center stripe_sub">
                    <Elements stripe={stripePromise}>
                      <CheckoutForm
                        toggle={this.toggle}
                        selectedOption={
                          this.state.selectedOption
                            ? this.state.selectedOption.value
                            : ""
                        }
                        setloader={(value) => this.setState({ loader: value })}
                        history={this.props.history}
                      />
                    </Elements>
                  </div>
                </div>
              </>
            )}
          </ModalBody>
          {this.state.subscription.payment_type === "Bank Transfer" ? (
            <ModalFooter className="text-center">
              <div style={{ margin: "0 auto" }}>
                <button
                  type="submit"
                  className="btn btn-danger btn-lg btn-shadow btn-multiple-state"
                  onClick={() => {
                    this.toggle();
                    infoNoti(
                      "Non puoi accedere ai contenuti del sito senza avere sottoscritto un Piano Tariffario!"
                    );
                  }}
                >
                  Cancella
                </button>{" "}
                &nbsp;&nbsp;
                <button
                  onClick={(e) => this.sendBankTransfer()}
                  className="btn btn-primary btn-lg btn-shadow btn-multiple-state"
                >
                  Invia
                </button>
              </div>
            </ModalFooter>
          ) : (
            ""
          )}
        </Modal>
      </Fragment>
    );
  }
}
export default injectIntl(Prices);
