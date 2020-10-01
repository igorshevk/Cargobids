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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
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

import { Link } from "react-router-dom";
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
} from "../../helpers/API";
import { sendError, getDateWithFormat } from "../../helpers/Utils";
import { URL_PREFIX } from "../../constants/defaultValues";

class FormLayoutsUi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bid: {},
      quote: {},
      carrier: [],
      modalFlag: false
    };

    this.getBid(this.props.match.params.bid_id);
    this.getQuote(this.props.match.params.id);
  }
  getBid(bid_id) {
    api.getBid(bid_id, (err, response) => {
      CONDITIONS_CHOICES.map((condition) => {
        if (condition.value === response.conditions)
          response.conditions = condition.label;
      });
      All_IN.map((al_in) => {
        if (al_in.value === response.all_in) response.all_in = al_in.label;
      });
      this.setState({ bid: response });

      this.getCarrier(response);
    });
  }

  getQuote(quote_id) {
    api.getQuote(quote_id, (err, response) => {
      // if(response.bid.publish !== null)
      //     this.props.history.push('/airline/quotes/'+response.id);
      this.setState({ quote: response });
    });
  }

  handleSubmit = (e) => {
    let bid = this.state.bid;
    bid.is_publish = true;
    api.publishBid({ id: bid.id, is_publish: true }, (err, response) => {
      if ("id" in response) {
        //        successNoti('bid has been published successfully');
        this.setState({ modalFlag: true })
        // this.props.history.push(
        //   "/" +
        //   URL_PREFIX +
        //   "/airline/quotes/" +
        //   this.state.quote.slug +
        //   "/bids/" +
        //   bid.id +
        //   "/information/"
        // );
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
  };

  getCarrier(bid) {
    api.list("carriers/" + bid.carrier + "/", {}, (err, response) => {
      this.setState({ carrier: response.data });
    });
  }

  toggleModal = () => {
    this.setState(prevState => ({
      modalFlag: !prevState.modalFlag
    }));
  };

  render() {
    const { messages } = this.props.intl;
    const {
      dimensions,
      quote,
      airports,
      modelsLoaded,
      airport,
      bid,
      carrier,
    } = this.state;

    return (
      <Fragment>
        <Row>
          <Colxx xxs="12" style={{ color: "#ff4500" }}>
            <h1>
              <IntlMessages id="bid.review" />
            </h1>
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row className="mb-4">
          <Colxx xxs="12">
            <Card>
              <CardBody>
                <Form>
                  <Row>
                    <Colxx sm={12} >
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={12}>
                          <CardTitle style={{
                            textAlign: "center",
                            color: "white",
                            backgroundColor: '#99bbff',
                          }}>INSERZIONE : {quote.title}</CardTitle>
                        </Label>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={3} >
                      <FormGroup>
                        <Label for="emailHorizontal">
                          <strong><IntlMessages id="forms.carrier" /></strong>
                        </Label>
                        <Label for="emailHorizontal">
                          {": " + bid.carrier}
                        </Label>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={3} >
                      <FormGroup>
                        <Label for="emailHorizontal" className="text-uppercase">
                          {carrier.length ? carrier[3] + ' - ' + carrier[2] : ''}
                        </Label>
                      </FormGroup>
                    </Colxx>
                  </Row>
                  <Row>
                    <Colxx sm={6} md={3}>
                      <FormGroup>
                        <Label for="emailHorizontal">
                          <strong><IntlMessages id="forms.rate" /></strong>
                        </Label>
                        <Label for="emailHorizontal">
                          &nbsp;&nbsp;{bid.rate ? parseFloat(bid.rate).toFixed(2) : bid.rate}
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
                          <strong><IntlMessages id="forms.surcharges" /></strong>
                        </Label>
                        <Label for="emailHorizontal">
                          &nbsp;&nbsp;{bid.surcharges ? parseFloat(bid.surcharges).toFixed(2) : bid.surcharges}
                        </Label>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={3}>
                      <FormGroup>
                        <Label for="emailHorizontal">
                          <strong><IntlMessages id="forms.cw_required" /></strong>
                        </Label>
                        <Label for="emailHorizontal">
                          &nbsp;&nbsp;{bid.cw_required ? parseFloat(bid.cw_required).toFixed(2) : bid.cw_required}
                        </Label>
                      </FormGroup>
                    </Colxx>
                  </Row>
                  <Row>
                    <Colxx sm={6} md={3}>
                      <FormGroup>
                        <Label for="emailHorizontal">
                          <strong><IntlMessages id="forms.origine" /></strong>
                        </Label>
                        <Label for="emailHorizontal">
                          &nbsp;&nbsp;{bid.origin}
                        </Label>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={3}>
                      <FormGroup>
                        <Label for="emailHorizontal">
                          <strong><IntlMessages id="forms.conditions" /></strong>
                        </Label>
                        <Label for="emailHorizontal" className="text-uppercase">
                          &nbsp;&nbsp;{bid.conditions}
                        </Label>
                      </FormGroup>
                    </Colxx>
                  </Row>
                  <Row>
                    {bid.publish ?
                      <Colxx sm={6} md={3} >
                        <FormGroup>
                          <Label for="emailHorizontal">
                            <strong>PUBBLICA</strong>
                          </Label>
                          <Label for="emailHorizontal">

                            &nbsp;&nbsp; {getDateWithFormat(new Date(bid.publish))}
                          </Label>
                        </FormGroup>
                      </Colxx> : ''}
                    <Colxx sm={6} md={3}>
                      <FormGroup>
                        <Label for="emailHorizontal">
                          <strong>STATUS</strong>
                        </Label>
                        <Label for="emailHorizontal">
                          &nbsp;&nbsp;{bid.status}
                        </Label>
                      </FormGroup>
                    </Colxx>
                  </Row>
                  <Row>
                    <Colxx sm={12}>
                      <FormGroup>
                        <Label for="emailHorizontal" className="text-uppercase">
                          <strong><IntlMessages id="forms.remarks" /></strong>
                        </Label>
                        <Label for="emailHorizontal" className="text-uppercase">
                          &nbsp;&nbsp;{bid.remarks}
                        </Label>
                      </FormGroup>
                    </Colxx>
                  </Row>
                  <Row>
                    <Colxx sm="12" className="text-right">
                      <Link color="danger" className="btn btn-danger btn-shadow btn-lg" to={"/" + URL_PREFIX + '/airline/quotes/' + quote.slug + '/bids/' + bid.id + '/update/'}>
                        Indietro
                        </Link>
                        &nbsp;&nbsp;&nbsp;
                          {bid && !bid.publish ?
                        <Button color="success" className="btn btn-shadow btn-lg" onClick={(e) => this.handleSubmit(e)}>
                          Pubblica
                              </Button> :
                        <Link className="btn btn-success btn-shadow btn-lg" to={"/" + URL_PREFIX + "/agent/quotes/" + quote.slug + "/view"}>
                          Conferma
                              </Link>
                      }
                    </Colxx>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Colxx>
        </Row>

        <Modal isOpen={this.state.modalFlag} toggle={this.toggleModal}>
          <ModalBody>
            <Card>
              <CardBody >
                <Form className="text-center">
                  <Label for="emailHorizontal" sm={6}>
                    <h1><strong>Transazione Completata!</strong></h1>
                  </Label>
                  <h3>La tua offerta e' stata pubblicata ed e' attualmente posizionata "{quote.ranked}" su un totale di {quote.total_bids} offerte ricevute finora.</h3>
                  <Label for="emailHorizontal">
                    <h2><strong>Vuoi migliorare la tua offerta?</strong></h2>
                  </Label>
                  <Button color="primary" className='btn-shadow btn-multiple-state btn btn-primary btn-lg' onClick={(e) => this.props.history.push('/' + URL_PREFIX + '/airline/quotes/' + quote.slug + '/bids/' + quote.bid.id + '/update/')}>
                    Si
                        </Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button color="success" className='btn-shadow btn-multiple-state btn btn-success btn-lg' onClick={(e) => this.props.history.push('/' + URL_PREFIX + '/airline/quotes/')}>
                    No
                        </Button>
                </Form>
              </CardBody>
            </Card>
          </ModalBody>
        </Modal>
      </Fragment>
    );
  }
}

export default injectIntl(FormLayoutsUi);
