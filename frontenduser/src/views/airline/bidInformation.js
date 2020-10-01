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
  STATUS_CHOICES,
  TYPES,
  ORIGIN_CHOICES,
  AREA_CHOICES,
  DROPDOWN_WAIT,
  loadOptions,
} from "../../helpers/API";
import { sendError } from "../../helpers/Utils";
import { URL_PREFIX } from "../../constants/defaultValues";

class FormLayoutsUi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bid: {},
      quote: {},
    };

    this.getQuote(this.props.match.params.id);
  }

  getQuote(quote_id) {
    api.getQuote(quote_id, (err, response) => {
      this.setState({ quote: response });
    });
  }

  render() {
    const { messages } = this.props.intl;
    const { quote } = this.state;
    //    consoole.log(quote)
    //    console.log(bid)
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12" style={{ color: "#ff4500" }}>
            <h1>QUOTAZIONE PUBBLICATA</h1>
            <Separator className="mb-5" />
          </Colxx>
        </Row>

        <Row className="mb-4">
          <Colxx xxs="12">
            <Card>
              <CardBody>
                <Form>
                  <Row>
                    <Colxx sm="12" className="text-center">
                      <Label for="emailHorizontal" sm={6}>
                        <CardTitle>
                          <h1>
                            <strong>Transazione Completata!</strong>
                          </h1>
                        </CardTitle>
                        <h3>
                          La tua offerta e' stata pubblicata ed e' attualmente
                          posizionata "{quote.ranked}" su un totale di{" "}
                          {quote.total_bids} offerte ricevute finora.
                        </h3>
                      </Label>
                    </Colxx>
                  </Row>
                  <Row>
                    <Colxx sm="12" className="text-center">
                      <Label for="emailHorizontal" sm={6}>
                        <h2>
                          <strong>Vuoi migliorare la tua offerta?</strong>
                        </h2>
                      </Label>
                      <Button
                        color="primary"
                        className="btn-shadow btn-multiple-state btn btn-primary btn-lg"
                        onClick={(e) =>
                          this.props.history.push(
                            "/" +
                              URL_PREFIX +
                              "/airline/quotes/" +
                              quote.slug +
                              "/bids/" +
                              quote.bid.id +
                              "/update/"
                          )
                        }
                      >
                        Si
                      </Button>
                      &nbsp;&nbsp;&nbsp;
                      <Button
                        color="success"
                        className="btn-shadow btn-multiple-state btn btn-success btn-lg"
                        onClick={(e) =>
                          this.props.history.push(
                            "/" + URL_PREFIX + "/airline/quotes/"
                          )
                        }
                      >
                        No
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
