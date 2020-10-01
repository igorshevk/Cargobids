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
  Form
} from "reactstrap";
import { injectIntl } from 'react-intl';

import IntlMessages from "../../helpers/IntlMessages";

import DatePicker from "react-datepicker";
import moment from "moment";
import TagsInput from "react-tagsinput";

import { Link } from "react-router-dom";
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
import { successNoti, errorNoti } from '../../helpers/Notifications';
import { toast } from 'react-toastify';
import {
  CONDITIONS_CHOICES,
  All_IN,
  ORIGIN_CHOICES,
  AREA_CHOICES,
  DROPDOWN_WAIT,
  loadOptions,
  isAgent
} from '../../helpers/API';
import { addDaysToDate, makeDbFormat, sendError } from '../../helpers/Utils';
import { URL_PREFIX } from '../../constants/defaultValues';


class FormLayoutsUi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bid: { quote: 0 },
      quote: {},
      selected_all_in: {},
      selected_origin: {},
      selected_conditions: {},
    };
    this.getBid(this.props.match.params.bid_id);
    this.getQuote(this.props.match.params.id);
  }

  getBid(bid_id) {
    api.getBid(bid_id, (err, response) => {

      if (response === undefined) {
        if (isAgent())
          this.props.history.push("/" + URL_PREFIX + '/agent/dashboard');
        else
          this.props.history.push("/" + URL_PREFIX + '/airline/dashboard');

        return false;
      }

      let selected_all_in = {}, selected_conditions = {}, selected_origin = {};
      CONDITIONS_CHOICES.map((condition) => {
        if (condition.value === response.conditions)
          this.setState({ selected_conditions: condition });
      })
      All_IN.map((al_in) => {
        if (al_in.value === response.all_in)
          this.setState({ selected_all_in: al_in });
      })
      ORIGIN_CHOICES.map((origin) => {
        if (origin.value === response.origin)
          this.setState({ selected_origin: origin });
      })

      response.rate = response.rate ? parseFloat(response.rate).toFixed(2) : response.rate;
      response.surcharges = response.surcharges ? parseFloat(response.surcharges).toFixed(2) : response.surcharges;
      response.cw_required = response.cw_required ? parseFloat(response.cw_required).toFixed(2) : response.cw_required;


      if (response.all_in == 'ALLIN') {
        response.surcharges = 0;
        this.setState({ readonly: true })
      }

      if (response.all_in == 'SC') {
        this.setState({ readonly: false })
      }

      this.setState({ bid: response })


    })
  }

  getQuote(quote_id) {
    api.getQuote(quote_id, (err, response) => {
      this.setState({ quote: response });
    })
  }


  changeHandler = (e) => {
    let bid = this.state.bid;
    // if(e.target.name === 'cw_required' && parseFloat(this.state.quote.weight) > parseFloat(e.target.value)) return false;
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
      errorNoti('CW: Should not be less than existing value');
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
  };

  handleSubmit = (e) => {
    let bid = this.state.bid;
    if (typeof bid.author === 'object' && bid.author !== null)
      bid.author = bid.author['id']
    console.log(bid.author)
    api.updateBid(bid, (err, response) => {
      if (response !== undefined && 'id' in response)
        this.props.history.push("/" + URL_PREFIX + '/airline/quotes/' + this.state.quote.slug + '/bids/' + response.id + '/review/')
      else {
        let errors = sendError(err);
        let errHtml = errors.map((err, i) => {
          return <div key={i}>{err}<br /></div>;
        })
        errorNoti(<div>{errHtml}</div>);
      }
    });
  }


  render() {
    const { messages } = this.props.intl;
    const { dimensions, quote, airports, modelsLoaded, airport, bid } = this.state;
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <h1>Update Bid</h1>
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
                          <CardTitle>Quote : {quote.title}</CardTitle>
                        </Label>

                      </FormGroup>
                    </Colxx>
                  </Row>
                  <Row>
                    <Colxx sm={6} md={4} >
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4}>
                          <IntlMessages id="forms.carrier" /> *
                        </Label>
                        <Colxx sm={8}>
                          <Input
                            className="border-dark"
                            maxlength={2}
                            name="carrier"
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
                          <IntlMessages id="forms.rate" /> *
                        </Label>
                        <Colxx sm={8}>
                          <Input
                            className="border-dark"
                            type="number"
                            name="rate"
                            value={bid.rate}
                            onBlur={(e) => this.blurHandler(e)}
                            placeholder={messages["forms.rate"]}
                            onChange={(e) => this.changeHandler(e)}
                          />
                        </Colxx>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={4}>
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4}>
                          <IntlMessages id="forms.all_in" /> *
                        </Label>
                        <Colxx sm={8}>
                          <Select
                            className="react-select border-dark"
                            classNamePrefix="react-select"
                            name="all_in"
                            value={this.state.selected_all_in}
                            onChange={(e) => this.selectChanged(e, 'all_in')}
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
                            type="number"
                            readOnly={this.state.readonly}
                            name="surcharges"
                            value={bid.surcharges}
                            onBlur={(e) => this.blurHandler(e)}
                            placeholder={messages["forms.surcharges"]}
                            onChange={(e) => this.changeHandler(e)}
                          />
                        </Colxx>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={4}>
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4}>
                          <IntlMessages id="forms.cw_required" /> *
                        </Label>
                        <Colxx sm={8}>
                          <Input
                            className="border-dark"
                            type="number"
                            name="cw_required"
                            value={bid.cw_required}
                            onBlur={(e) => this.blurHandler(e)}
                            placeholder={messages["forms.cw_required"]}
                            onChange={(e) => this.changeHandler(e)}
                          />
                        </Colxx>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={4}>
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4}>
                          <IntlMessages id="forms.origine" /> *
                        </Label>
                        <Colxx sm={8}>
                          <Select
                            className="react-select border-dark"
                            classNamePrefix="react-select"
                            name="form-field-name"
                            value={this.state.selected_origin}
                            onChange={(e) => this.selectChanged(e, 'origin')}
                            options={ORIGIN_CHOICES}
                            placeholder={messages["forms.origine"]}
                          />
                        </Colxx>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={4}>
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4}>
                          <IntlMessages id="forms.conditions" /> *
                        </Label>
                        <Colxx sm={8}>
                          <Select
                            className="react-select border-dark"
                            classNamePrefix="react-select"
                            name="form-field-name"
                            value={this.state.selected_conditions}
                            onChange={(e) => this.selectChanged(e, 'conditions')}
                            options={CONDITIONS_CHOICES}
                            placeholder={messages["forms.conditions"]}
                          />
                        </Colxx>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={4}>
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4}>
                          <IntlMessages id="forms.remarks" />
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
                      <Button color="primary" onClick={(e) => this.handleSubmit(e)} className="float-right btn-shadow btn btn-primary btn-lg">
                        Update
                        </Button>
                      <Link style={{ marginRight: '3px' }} to={"/" + URL_PREFIX + '/agent/quotes/' + quote.slug + '/view'} className="btn btn-danger float-right btn-shadow btn-lg">
                        Return
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

export default injectIntl(FormLayoutsUi)