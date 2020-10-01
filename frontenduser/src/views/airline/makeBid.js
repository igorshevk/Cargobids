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
  Tooltip,
  Label,
  CustomInput,
  Button,
  FormText,
  Form,
} from "reactstrap";
import { injectIntl } from 'react-intl';

import IntlMessages from "../../helpers/IntlMessages";

import DatePicker from "react-datepicker";
import moment from "moment";
import TagsInput from "react-tagsinput";

import "react-tagsinput/react-tagsinput.css";
import "react-datepicker/dist/react-datepicker.css";
import "rc-switch/assets/index.css";
import "rc-slider/assets/index.css";
import "react-rater/lib/react-rater.css";
//import PopoverItem from "../../../../components/common/PopoverItem";
//import TooltipItem from "../../../../components/common/TooltipItem";

import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";

import Select from "react-select";
import CustomSelectInput from "../../components/common/CustomSelectInput";
import api from "../../services/api";
import { successNoti, errorNoti } from '../../helpers/Notifications';
import { toast } from 'react-toastify';
import { CONDITIONS_CHOICES, All_IN, ORIGIN_CHOICES, AREA_CHOICES, DROPDOWN_WAIT, loadOptions } from '../../helpers/API';
import { addDaysToDate, makeDbFormat, sendError } from '../../helpers/Utils';
import { Link } from "react-router-dom";
import { URL_PREFIX } from '../../constants/defaultValues'


class FormLayoutsUi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bid: { quote: 0, cw_required: 0.0, allow_same_company: false },
      quote: {},
      tooltipOpen_1: false,
      tooltipOpen_2: false,
      tooltipOpen_3: false,
      tooltipOpen_4: false,
      readonly: false,
      selected_origin: {},
      selected_area: {},
      selected_all_in: {},
      selected_origin: {},
      dimensions: [],
    };
    this.toggle = this.toggle.bind(this);
    this.toggle_1 = this.toggle_1.bind(this);
    this.toggle_2 = this.toggle_2.bind(this);
    this.toggle_3 = this.toggle_3.bind(this);
    this.getQuote(this.props.match.params.id);
  }

  getQuote(quote_id) {
    api.getQuote(quote_id, (err, response) => {
      this.setState({ quote: response });

      let bid = this.state.bid
      bid.cw_required = this.state.quote.weight;
      this.setState({ bid: bid, quote: this.state.quote });

    })
  }



  toggle() {
    this.setState({
      tooltipOpen_1: !this.state.tooltipOpen_1,
    });
  }

  toggle_1() {
    this.setState({
      tooltipOpen_2: !this.state.tooltipOpen_2,
    });
  }

  toggle_2() {
    this.setState({
      tooltipOpen_3: !this.state.tooltipOpen_3,
    });
  }

  toggle_3() {
    this.setState({
      tooltipOpen_4: !this.state.tooltipOpen_4,
    });
  }

  changeHandler = (e) => {
    let bid = this.state.bid;
    bid[e.target.name] = e.target.value;
    this.setState({ bid: bid });
  }

  blurHandler = (e) => {
    let bid = this.state.bid;
    if (e.target.name === 'cw_required' || e.target.name === 'surcharges' || e.target.name === 'rate')
      bid[e.target.name] = e.target.value ? parseFloat(e.target.value).toFixed(2) : e.target.value;
    else
      bid[e.target.name] = e.target.value;
    if (e.target.name === 'cw_required' && parseFloat(this.state.quote.weight) > parseFloat(e.target.value)) {
      bid[e.target.name] = parseFloat(this.state.quote.weight);
      errorNoti("CW: Should not be less than existing value");
    }
    this.setState({ bid: bid });
  }

  selectChanged(value, key) {
    let bid = this.state.bid;
    bid[key] = value.value
    this.setState({ ['selected_' + key]: value, bid: bid });

    if (bid.all_in == 'ALLIN') {
      bid.surcharges = 0;
      this.setState({ bid: bid })
      this.setState({ readonly: true })
    }

    if (bid.all_in == 'SC') {
      this.setState({ readonly: false })
    }
  }

  handleSubmit = (e) => {
    let bid = this.state.bid;

    bid.quote = this.state.quote.id;

    console.log(bid);
    api.createBid(bid, (response) => {
      if ('id' in response)
        this.props.history.push('/' + URL_PREFIX + '/airline/quotes/' + this.state.quote.slug + '/bids/' + response.id + '/review/')
      else {
        let errors = sendError(response);
        let errHtml = errors.map((err, i) => {
          return <div key={i}>{err}<br /></div>;
        })

        if ('Warning' in response) {
          let bid = this.state.bid;
          bid.allow_same_company = true;
          this.setState({ bid: bid })
          errorNoti(<div>{errHtml}</div>, false);
        } else {
          errorNoti(<div>{errHtml}</div>);
        }
      }
    });
  }



  toInputUppercase = e => {
    e.target.value = ("" + e.target.value).toUpperCase();
  };




  toInputUppercase = (e) => {
    e.target.value = ("" + e.target.value).toUpperCase();
  };

  render() {
    const { messages } = this.props.intl;
    const { quote, airports, modelsLoaded, airport, bid, tooltipOpen } = this.state;

    console.log(bid.cw_required)
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12" style={{ color: "#ff4500" }}>
            <h1>INVIA QUOTAZIONE</h1>
            <Separator className="mb-5" />
          </Colxx>
        </Row>

        <Row className="mb-4">
          <Colxx xxs="12">
            <Card>
              <CardBody>
                <Form>
                  <Row>
                    <Colxx sm="12">
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={12}>
                          <CardTitle style={{
                            textAlign: "center",
                            color: "white",
                            backgroundColor: '#1a01fd',
                          }}>INSERZIONE: {quote.title}</CardTitle>
                        </Label>
                      </FormGroup>
                    </Colxx>
                  </Row>
                  <Row>
                    <Colxx sm={6} md={4}>
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4}>
                          <IntlMessages id="forms.carrier" /> *
                        </Label>
                        <Colxx sm={8}>
                          <Input
                            className="border-dark"
                            maxlength={2}
                            name="carrier"
                            onInput={(e) => this.toInputUppercase(e)}
                            value={bid.carrier}
                            placeholder={messages["forms.carrier"]}
                            onChange={(e) => this.changeHandler(e)}
                          />
                        </Colxx>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={4}>
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4}>
                          TARIFFA *
                        </Label>
                        <Colxx sm={8}>
                          <Input
                            className="border-dark"
                            type="number"
                            name="rate"
                            value={bid.rate}
                            precision={2}
                            placeholder={messages["forms.rate"]}
                            onBlur={(e) => this.blurHandler(e)}
                            onChange={(e) => this.changeHandler(e)}
                          />
                        </Colxx>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={4}>
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4}>
                          TIPOLOGIA *
                        </Label>
                        <Colxx sm={8}>
                          <Select
                            className="react-select border-dark"
                            classNamePrefix="react-select"
                            name="all_in"
                            value={this.state.selected_all_in}
                            onChange={(e) => this.selectChanged(e, "all_in")}
                            options={All_IN}
                            placeholder={messages["forms.all_in"]}
                          />
                        </Colxx>
                      </FormGroup>
                    </Colxx>
                  </Row>
                  <Row>
                    <Colxx sm={6} md={4}>
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4}>
                          <IntlMessages id="forms.surcharges" /> *
                        </Label>
                        <Colxx sm={8}>
                          <Input
                            className="border-dark"
                            maxlength={2}
                            readOnly={this.state.readonly}
                            type="number"
                            name="surcharges"
                            value={bid.surcharges}
                            placeholder={'0.00'}
                            onBlur={(e) => this.blurHandler(e)}
                            onChange={(e) => this.changeHandler(e)}
                          />
                        </Colxx>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={4}>
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4}>
                          CW APPLICABILE &nbsp;
                          <i id="Tooltipdeadline" className="fa fa-question-circle" aria-hidden="true" id="TooltipCw"></i>
                          <Tooltip placement="right" isOpen={this.state.tooltipOpen_1} target="TooltipCw" toggle={this.toggle}>
                            <IntlMessages id="forms.cw_tooltip" />
                          </Tooltip>
                        </Label>

                        <Colxx sm={8}>
                          <Input
                            className="border-dark"
                            type="number"
                            name="cw_required"
                            value={bid.cw_required}
                            placeholder={bid.cw_required}
                            onBlur={(e) => this.blurHandler(e)}
                            onChange={(e) => this.changeHandler(e)}
                          />
                        </Colxx>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={4}>
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4}>
                          <IntlMessages id="forms.origine" />  &nbsp;
                          <i id="Tooltipdeadline" className="fa fa-question-circle" aria-hidden="true" id="TooltipOrigin"></i>
                          <Tooltip placement="right" isOpen={this.state.tooltipOpen_2} target="TooltipOrigin" toggle={this.toggle_1}>
                            <IntlMessages id="forms.origin_tooltip" />
                          </Tooltip>
                        </Label>

                        <Colxx sm={8}>
                          <Select
                            className="react-select border-dark"
                            classNamePrefix="react-select"
                            name="form-field-name"
                            value={this.state.selected_origin}
                            onChange={(e) => this.selectChanged(e, "origin")}
                            options={ORIGIN_CHOICES}
                            placeholder={messages["forms.origin"]}
                          />
                        </Colxx>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={4}>
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4}>
                          <IntlMessages id="forms.conditions" /> &nbsp;
                          <i id="Tooltipdeadline" className="fa fa-question-circle" aria-hidden="true" id="TooltipCondition"></i>
                          <Tooltip placement="right" isOpen={this.state.tooltipOpen_3} target="TooltipCondition" toggle={this.toggle_2}>
                            <IntlMessages id="forms.condition_tooltip" />
                          </Tooltip>
                        </Label>

                        <Colxx sm={8}>
                          <Select
                            className="react-select border-dark"
                            classNamePrefix="react-select"
                            name="form-field-name"
                            value={this.state.selected_conditions}
                            onChange={(e) => this.selectChanged(e, 'conditions')}
                            options={CONDITIONS_CHOICES}
                            placeholder={CONDITIONS_CHOICES[0]["label"]}
                          />
                        </Colxx>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={4}>
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4}>
                          <IntlMessages id="forms.remarks" />&nbsp;
                          <i id="Tooltipdeadline" className="fa fa-question-circle" aria-hidden="true" id="TooltipRemarks"></i>
                          <Tooltip placement="right" isOpen={this.state.tooltipOpen_4} target="TooltipRemarks" toggle={this.toggle_3}>
                            <IntlMessages id="forms.remarks_tooltip" />
                          </Tooltip>
                        </Label>
                        <Colxx sm={8}>
                          <Input type="text" maxlength={12}
                            className="border-dark" name="remarks" onChange={(e) => this.changeHandler(e)} rows="3"
                            value={bid.remarks} />
                        </Colxx>
                      </FormGroup>
                    </Colxx>
                  </Row>

                  <Row>
                    <Colxx sm="12">
                      <Button color="primary" onClick={(e) => this.handleSubmit(e)} className="float-right btn-shadow btn-multiple-state btn btn-primary btn-lg">
                        <IntlMessages id="forms.avanti" />
                      </Button>
                      <Link style={{ marginRight: '3px' }} to={'/' + URL_PREFIX + '/agent/quotes/' + quote.slug + '/view'} className="btn btn-danger float-right btn-shadow btn-multiple-state btn-lg mr-2">
                        Indietro
                      </Link>
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
