import React, { Component, Fragment } from "react";
import {
  Row,
  Card,
  CardBody,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  CardTitle,
  FormGroup,
  Label,
  CustomInput,
  Button,
  FormText,
  Form,
} from "reactstrap";
import { injectIntl } from "react-intl";

import IntlMessages from "../../helpers/IntlMessages";

import DatePicker from "react-datepicker";
import moment from "moment";
import TagsInput from "react-tagsinput";

import "react-tagsinput/react-tagsinput.css";
import "react-datepicker/dist/react-datepicker.css";
import "rc-switch/assets/index.css";
import "rc-slider/assets/index.css";
import "react-rater/lib/react-rater.css";

import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";

import Select from "react-select";
import CustomSelectInput from "../../components/common/CustomSelectInput";
import api from "../../services/api";
import { successNoti, errorNoti } from "../../helpers/Notifications";
import { toast } from "react-toastify";
import {
  CONDITIONS_CHOICES,
  All_IN,
  STATUS_CHOICES,
  TYPES,
  ORIGIN_CHOICES,
  AREA_CHOICES,
  DROPDOWN_WAIT,
  loadOptions,
  isAgent,
  isAirline,
} from "../../helpers/API";
import { sendError, getDateWithFormat } from "../../helpers/Utils";
import { URL_PREFIX } from "../../constants/defaultValues";
import { Link } from "react-router-dom";

class FormLayoutsUi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bid: { publish: "", status: "" },
      carrier: [],
      author_detail: {
        author_id: 0,
        firstname: "",
        lastname: "",
        email: "",
        date_joined: "",
        agent_company: "",
        airline_company: "",
        companyname: "",
        address: "",
        city: "",
        zip_code: "",
      },
      quote: {},
    };

    this.getBid(this.props.match.params.bid_id);
    this.getQuote(this.props.match.params.id);
  }

  getBid(bid_id) {
    api.getBid(bid_id, (err, response) => {
      if (response === undefined) {
        if (isAgent())
          this.props.history.push("/" + URL_PREFIX + "/agent/dashboard");
        else this.props.history.push("/" + URL_PREFIX + "/airline/dashboard");

        return false;
      }
      CONDITIONS_CHOICES.map((condition) => {
        if (condition.value === response.conditions)
          response.conditions = condition.label;
      });
      All_IN.map((al_in) => {
        if (al_in.value === response.all_in) response.all_in = al_in.label;
      });

      this.setState({ bid: response });

      this.getCarrier(response);

      let bid = this.state.bid;
      let auth_detail = this.state.author_detail;
      auth_detail.author_id = bid.author["id"];
      auth_detail.firstname = bid.author["firstname"];
      auth_detail.lastname = bid.author["lastname"];
      auth_detail.email = bid.author["email"];
      auth_detail.date_joined = bid.author["date_joined"];
      auth_detail.airline_company = bid.author["airline_company"];
      auth_detail.agent_company = bid.author["agent_company"];
      auth_detail.companyname = bid.author["companyname"];
      auth_detail.address = bid.author["address"];
      auth_detail.city = bid.author["city"];
      auth_detail.zip_code = bid.author["zip_code"];
      this.setState({ author_detail: auth_detail });
    });
  }

  getQuote(quote_id) {
    api.getQuote(quote_id, (err, response) => {
      this.setState({ quote: response });
    });
  }

  getCarrier(bid) {
    api.list("carriers/" + bid.carrier + "/", {}, (err, response) => {
      this.setState({ carrier: response.data });
    });
  }

  render() {
    const { messages } = this.props.intl;
    const {
      dimensions,
      quote,
      airports,
      modelsLoaded,
      airport,
      bid,
      author_detail,
      carrier,
    } = this.state;
    console.log("author", author_detail);

    let email_subject = `REF: Quote Title   ${quote.title}`;
    let email_body = `Quote Details%0D%0A
            Origin: ${quote.origin}%0D%0A
            Sigla Aeroporto Destinazione:   ${quote.destination}%0D%0A
            Number of pieces:   ${quote.pieces}%0D%0A
            Peso (Kgs): ${quote.kilos}%0D%0A
            Volume: ${quote.volume}%0D%0A
            Chargeable Weight:  ${quote.weight}%0D%0A
%0D%0A
Your Quotations%0D%0A
            Vettore:    ${bid.carrier}%0D%0A
${carrier.length > 0 ? `            ${carrier[3]}:   ${carrier[2]}%0D%0A` : ``}
            Tarifffa Offerta (Eur):    ${bid.rate}%0D%0A
            Tipe Di Tariffa:    ${bid.all_in}%0D%0A
            Surcharges Applicable:  ${bid.surcharges}%0D%0A
            CW Richiesto (kgs): ${bid.cw_required}%0D%0A
%0D%0A
ENTER YOUR TEXT HERE:
            `;
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12" style={{ color: "#ff4500" }}>
            <h1>DETTAGLIO QUOTAZIONE</h1>
            <Separator className="mb-5" />
          </Colxx>
        </Row>

        <Row className="mb-4">
          <Colxx xxs="12">
            <Card>
              <CardBody>
                <Form>
                  <Row>
                    <Colxx sm={12}>
                      <FormGroup>
                        <Label
                          for="emailHorizontal"
                          className="text-uppercase"
                          style={{
                            backgroundColor: "#1565c0",
                            borderColor: "#9400D3",
                            color: "white",
                            marginLeft: "-23px",
                          }}
                        >
                          TITOLO INSERZIONE: {quote.title}
                        </Label>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={3}>
                      <FormGroup>
                        <Label for="emailHorizontal">
                          <strong>
                            <IntlMessages id="forms.carrier" />
                          </strong>
                        </Label>
                        <Label for="emailHorizontal">
                          {": " + bid.carrier}
                        </Label>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={3}>
                      <FormGroup>
                        <Label for="emailHorizontal" className="text-uppercase">
                          {carrier.length
                            ? carrier[3] + " - " + carrier[2]
                            : ""}
                        </Label>
                      </FormGroup>
                    </Colxx>
                  </Row>
                  <Row>
                    <Colxx sm={6} md={3}>
                      <FormGroup>
                        <Label for="emailHorizontal">
                          <strong>
                            <IntlMessages id="forms.rate" />
                          </strong>
                        </Label>
                        <Label for="emailHorizontal">
                          &nbsp;&nbsp;
                          {bid.rate
                            ? parseFloat(bid.rate).toFixed(2)
                            : bid.rate}
                        </Label>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={3}>
                      <FormGroup>
                        <Label for="emailHorizontal">
                          <strong>TIPO DI TARIFFA</strong>
                        </Label>
                        <Label for="emailHorizontal">
                          &nbsp;&nbsp;{bid.all_in}
                        </Label>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={3}>
                      <FormGroup>
                        <Label for="emailHorizontal">
                          <strong>
                            <IntlMessages id="forms.surcharges" />
                          </strong>
                        </Label>
                        <Label for="emailHorizontal">
                          &nbsp;&nbsp;
                          {bid.surcharges
                            ? parseFloat(bid.surcharges).toFixed(2)
                            : bid.surcharges}
                        </Label>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={3}>
                      <FormGroup>
                        <Label for="emailHorizontal">
                          <strong>
                            <IntlMessages id="forms.cw_required" />
                          </strong>
                        </Label>
                        <Label for="emailHorizontal">
                          &nbsp;&nbsp;
                          {bid.cw_required
                            ? parseFloat(bid.cw_required).toFixed(2)
                            : bid.cw_required}
                        </Label>
                      </FormGroup>
                    </Colxx>
                  </Row>
                  <Row>
                    <Colxx sm={6} md={3}>
                      <FormGroup>
                        <Label for="emailHorizontal">
                          <strong>
                            <IntlMessages id="forms.origine" />
                          </strong>
                        </Label>
                        <Label for="emailHorizontal">
                          &nbsp;&nbsp;{bid.origin}
                        </Label>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={9}>
                      <FormGroup>
                        <Label for="emailHorizontal">
                          <strong>
                            <IntlMessages id="forms.conditions" />
                          </strong>
                        </Label>
                        <Label for="emailHorizontal" className="text-uppercase">
                          &nbsp;&nbsp;{bid.conditions}
                        </Label>
                      </FormGroup>
                    </Colxx>
                  </Row>
                  <Row>
                    <Colxx sm={6} md={3}>
                      <FormGroup>
                        <Label for="emailHorizontal">
                          <strong>PUBLISH</strong>
                        </Label>
                        <Label for="emailHorizontal">
                          &nbsp;&nbsp;{getDateWithFormat(new Date(bid.publish))}
                        </Label>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={9}>
                      <FormGroup>
                        <Label for="emailHorizontal">
                          <strong>STATUS</strong>
                        </Label>
                        <Label for="emailHorizontal">
                          &nbsp;&nbsp;{bid.status}
                        </Label>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={12}>
                      <FormGroup>
                        <Label for="emailHorizontal" className="text-uppercase">
                          <strong>
                            <IntlMessages id="forms.remarks" />
                          </strong>
                        </Label>
                        <Label for="emailHorizontal" className="text-uppercase">
                          &nbsp;&nbsp;{bid.remarks}
                        </Label>
                      </FormGroup>
                    </Colxx>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Colxx>
        </Row>

        <Row className="mb-4">
          <Colxx xxs="12">
            <Card>
              <CardBody>
                <Form>
                  <Row>
                    <Colxx sm="6">
                      <FormGroup row>
                        <Label
                          for="emailHorizontal"
                          sm={6}
                          style={{ color: "#ff4500" }}
                        >
                          <CardTitle>Autore dell'Inserzione</CardTitle>
                        </Label>
                      </FormGroup>
                    </Colxx>
                  </Row>
                  <Row>
                    <Colxx sm={6} md={4}>
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4}>
                          <strong>NOME</strong>
                        </Label>
                        <Label for="emailHorizontal" sm={8}>
                          {author_detail.firstname +
                            " " +
                            author_detail.lastname}
                        </Label>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={4}>
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4}>
                          <strong>EMAIL</strong>
                        </Label>
                        <Label for="emailHorizontal" sm={8}>
                          {author_detail.email}
                        </Label>
                      </FormGroup>
                    </Colxx>
                  </Row>
                  <Row>
                    <Colxx sm={6} md={4}>
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4}>
                          <strong>AGENTE</strong>
                        </Label>
                        <Label for="emailHorizontal" sm={8}>
                          {author_detail.airline_company.airline_company_name}
                        </Label>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={4}>
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4}>
                          <strong>CITTA'</strong>
                        </Label>
                        <Label for="emailHorizontal" sm={8}>
                          {author_detail.airline_company.city}
                        </Label>
                      </FormGroup>
                    </Colxx>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Colxx>
        </Row>

        <Row className="mb-4">
          <Colxx xxs="12">
            <Card>
              <CardBody>
                <Form>
                  <Row>
                    <Colxx sm="12" className="text-center">
                      <Button
                        className="btn-shadow btn-lg"
                        color="primary"
                        onClick={(e) => {
                          return isAgent()
                            ? this.props.history.push(
                                "/" +
                                  URL_PREFIX +
                                  "/agent/quotes/" +
                                  this.state.quote.slug +
                                  "/view/"
                              )
                            : this.props.history.push(
                                "/airline/quotes/" +
                                  this.state.quote.slug +
                                  "/view/"
                              );
                        }}
                      >
                        Back
                      </Button>
                      &nbsp;&nbsp;&nbsp;
                      {/* <a href="mailto:email@mycompany.com?subject=Subscribe&body=Lastame%20%3A%0D%0AFirstname%20%3A" */}
                      <a
                        href={`mailto:${author_detail.email}?subject=${email_subject}&body=${email_body}`}
                        className="btn btn-shadow btn-lg btn-success"
                      >
                        Email
                      </a>
                      &nbsp;&nbsp;&nbsp;
                      <Button
                        className="btn-shadow btn-lg"
                        color="info"
                        onClick={(e) =>
                          this.props.history.push(
                            "/" + URL_PREFIX + "/agent/chat/"
                          )
                        }
                      >
                        Chat
                      </Button>
                    </Colxx>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}

export default injectIntl(FormLayoutsUi);
