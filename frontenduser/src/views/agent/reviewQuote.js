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
import { injectIntl} from 'react-intl';

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
import {successNoti, errorNoti} from '../../helpers/Notifications';
import { toast } from 'react-toastify';
import {
  STATUS_CHOICES,
  TYPES,
  ORIGIN_CHOICES,
  AREA_CHOICES,
  DROPDOWN_WAIT,
  loadOptions,
  TYPES_CHOICES
} from '../../helpers/API';
import { URL_PREFIX } from '../../constants/defaultValues'
import {getDateWithFormat, sendError} from '../../helpers/Utils';

const selectData = [
  { label: "GKA", value: "cake", key: 0 },
  { label: "MAG", value: "cupcake", key: 1 },
  { label: "HGU", value: "dessert", key: 2 }
];


class FormLayoutsUi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: "",
      selectedOptionLabelOver: "",
      selectedOptionLabelTop: "",
      startDate: null,
      startDateLabelOver: null,
      startDateLabelTop: null,
      startDateTime: null,
      startDateRange: null,
      endDateRange: null,
      embeddedDate: moment(),
      tags: [],
      tagsLabelOver: [],
      tagsLabelTop: [],
      dimension:{
        colli:0,
        length:0,
        width:0,
        height:0,
        cbm:0,
      },
      quote:{
        kilos:0,
        gencargo:true,
        dgr:false,
        perishable:false,
        stackable:true,
        tiltable:false,
        special_cargo:false,
        chargeable_weight:0,
        net_volume:0,
        note:'',
        total_pieces:0,
      },
      airports:[],
      selected_destination:{},
      selected_area:{},
      selected_origin:{},
      modelsLoaded: false,
      airport:'',
      dimensions:[]
    };

    this.getQuote(this.props.match.params.id);
  }

  getQuote(quote_id) {
    api.getQuote(quote_id,(err, response)=>{
      if(response.publish !== null)
        this.props.history.push('/'+URL_PREFIX+'/agent/quotes');

      AREA_CHOICES.map((area) => {
        if(area.value === response.area)
          response.area = area.label;
      })
      ORIGIN_CHOICES.map((origin) => {
        if(origin.value === response.origin)
          response.origin = origin.label;
      })

      TYPES_CHOICES.map((type) => {
        if(type.value === response.types)
          response.types = type.label;
      })
      let dimensions = JSON.parse(response.dimensions)
      this.setState({dimensions:dimensions, quote:response});
      this.generateOutput(dimensions);
      this.getAirport(response.destination);
    })
  }

  getAirport(code) {
    if(code.length > 2) {
      api.getAirport(code,(err, response)=>{
        if(response.data.length) {
          let quote = this.state.quote;
          quote.destination = `${response.data[1]}, ${response.data[2]}`
          this.setState({quote:quote});
        }
      })
    }
  }

  generateOutput = (newDimensions) => {
    let net_volume = 0, total_pieces = 0;
    newDimensions.map((dimension, i) => {
      net_volume += parseFloat(dimension.cbm);
      total_pieces += parseInt(dimension.colli);
    })


    let chargeable = net_volume / 6000;
//    let weight = parseInt(this.state.quote.kilos) ;
//    if(chargeable < this.state.quote.kilos)
//      chargeable = this.state.quote.kilos

    let quote = this.state.quote;
    quote.chargeable_weight = parseInt(chargeable).toFixed(2);
    quote.net_volume = (net_volume / 1000000).toFixed(2);
    quote.total_pieces = total_pieces;
    this.setState({quote:quote});
  }


  handleSubmit = (e) => {
    let quote = this.state.quote;
    quote.is_publish = true
    api.publishQuote({slug:quote.slug, is_publish:true},(err, response)=>{
      if('id' in response) {
        successNoti('Quote has been published successfully');
        this.props.history.push('/'+URL_PREFIX+'/agent/quotes/')
      }
      else{
        let errors = sendError(response);
        let errHtml = errors.map((err, i) => {
          return <div key={i}>{err}<br/></div>;
        })
        errorNoti(<div>{errHtml}</div>);
      }
    });
  }

  render() {
    const { messages } = this.props.intl;
    const { dimensions, quote, airports, modelsLoaded, airport } = this.state;
    return (
        <Fragment>
          <Row>
            <Colxx xxs="12">
              <h1><IntlMessages id="quote.review" /></h1>
              <Separator className="mb-5" />
            </Colxx>
          </Row>

          <Row className="mb-4">
            <Colxx xxs="12">
              <Card>
                <CardBody>
                  <Form>
                    <Row>
                      <Colxx sm="6">
                        <Row>
                          <Label for="emailHorizontal" sm={2}>
                            <CardTitle className="mb-0"><IntlMessages id="forms.title" /></CardTitle>
                          </Label>
                          <Label for="emailHorizontal" sm={10}>
                            <CardTitle className="mb-0">{quote.title}</CardTitle>
                          </Label>
                        </Row>
                      </Colxx>
                      <Colxx sm={6}>
                        <FormGroup row>
                          <Label for="emailHorizontal" sm={4}>
                            <strong><IntlMessages id="forms.types" /></strong>
                          </Label>
                          <Label for="emailHorizontal" sm={8}>
                            {quote.types}
                          </Label>
                        </FormGroup>
                      </Colxx>
                    </Row>
                    <hr/>
                    <Row>
                      <Colxx sm={6} md={4}>
                        <FormGroup row>
                          <Label for="emailHorizontal" sm={4}>
                            <strong><IntlMessages id="forms.area" /></strong>
                          </Label>
                          <Label for="emailHorizontal" sm={8}>
                            {quote.area}
                          </Label>
                        </FormGroup>
                      </Colxx>
                      <Colxx sm={6} md={4}>
                        <FormGroup row>
                          <Label for="emailHorizontal" sm={4}>
                            <strong><IntlMessages id="forms.origin" /></strong>
                          </Label>
                          <Label for="emailHorizontal" sm={8}>
                            {quote.origin}
                          </Label>
                        </FormGroup>
                      </Colxx>
                      <Colxx sm={6} md={4}>
                        <FormGroup row>
                          <Label for="emailHorizontal" sm={4}>
                            <strong><IntlMessages id="forms.destination" /></strong>
                          </Label>
                          <Label for="emailHorizontal" sm={8}>
                            {quote.destination}
                          </Label>
                        </FormGroup>
                      </Colxx>
                    </Row>
                    <Row>
                      <Colxx sm={12} md={4}>
                        <FormGroup row>
                          <Label for="emailHorizontal" sm={4}>
                            <strong><IntlMessages id="forms.piece" /></strong>
                          </Label>
                          <Label for="emailHorizontal" sm={8}>
                            {quote.pieces}
                          </Label>
                        </FormGroup>
                      </Colxx>
                      <Colxx sm={12} md={4}>
                        <FormGroup row>
                          <Label for="emailHorizontal" sm={4}>
                            <strong><IntlMessages id="forms.kilo" /></strong>
                          </Label>
                          <Label for="emailHorizontal" sm={8}>
                            {quote.kilos ? parseFloat(quote.kilos).toFixed(2) : quote.kilos}
                          </Label>
                        </FormGroup>
                      </Colxx>
                      <Colxx sm={12} md={4}>
                        <FormGroup row>
                          <Label for="emailHorizontal" sm={4}>
                            <strong><IntlMessages id="forms.volume" /></strong>
                          </Label>
                          <Label for="emailHorizontal" sm={8}>
                            {quote.volume ? parseFloat(quote.volume).toFixed(2) : quote.volume}
                          </Label>
                        </FormGroup>
                      </Colxx>
                    </Row>
                    <Row>
                      <Colxx sm={12} md={4}>
                        <FormGroup row>
                          <Label for="emailHorizontal" sm={4}>
                            <strong><IntlMessages id="forms.cw" /></strong>
                          </Label>
                          <Label for="emailHorizontal" sm={8}>
                            {quote.weight ? parseFloat(quote.weight).toFixed(2) : quote.weight}
                          </Label>
                        </FormGroup>
                      </Colxx>
                    </Row>
                    <hr/>

                    {dimensions.length ?
                        <>
                          <Row>
                            <Colxx sm={12}>
                              <CardTitle><IntlMessages id="forms.dimensions" /></CardTitle>
                            </Colxx>
                            <Colxx sm={12}>
                              <table id="cubic_table" className="calculation-table table">
                                <thead>
                                <tr>
                                  <th scope="col">Colli</th>
                                  <th scope="col">Length</th>
                                  <th scope="col">Wdith</th>
                                  <th scope="col">Height</th>
                                  <th scope="col">CBM</th>
                                </tr>
                                </thead>
                                <tbody>
                                {dimensions.map((dimension, i) => {
                                  return <tr class="table_0">
                                    <td>{dimension.colli} </td>
                                    <td> {dimension.length} </td>
                                    <td> {dimension.width} </td>
                                    <td > {dimension.height} </td>
                                    <td class="table_0" style={{width:'20%'}}>{(dimension.cbm / 1000000).toFixed(2)}</td>
                                  </tr>
                                })}
                                </tbody>
                              </table>
                            </Colxx>
                          </Row>
                          <hr/>
                          <br/></> : ''}
                    <Row>
                      <Colxx sm={4} xs={6}>
                        <Label for="emailHorizontal">
                          <strong><IntlMessages id="forms.general-cargo" /> : &nbsp; &nbsp; &nbsp;
                          </strong>
                        </Label>
                        {quote.gencargo ? 'Yes':  'No'}
                      </Colxx>

                      <Colxx sm={4} xs={6}>
                        <Label for="emailHorizontal">
                          <strong><IntlMessages id="forms.stackable" /></strong> : &nbsp; &nbsp; &nbsp;
                        </Label>
                        {quote.stackable ? 'Yes':  'No'}
                      </Colxx>

                      <Colxx sm={4} xs={6}>
                        <Label for="emailHorizontal">
                          <strong><IntlMessages id="forms.tiltable" /></strong> : &nbsp; &nbsp; &nbsp;
                        </Label>
                        {quote.tiltable ? 'Yes':  'No'}
                      </Colxx>

                      {!quote.gencargo ?
                          <>
                            <Colxx sm={4} xs={6}>
                              <Label for="emailHorizontal">
                                <strong><IntlMessages id="forms.dgr" /></strong> : &nbsp; &nbsp; &nbsp;
                              </Label>
                              {quote.dgr ? 'Yes':  'No'}
                            </Colxx>

                            <Colxx sm={4} xs={6}>
                              <Label for="emailHorizontal">
                                <strong><IntlMessages id="forms.perishable" /></strong> : &nbsp; &nbsp; &nbsp;
                              </Label>
                              {quote.perishable ? 'Yes':  'No'}
                            </Colxx>

                            <Colxx sm={4} xs={6}>
                              <Label for="emailHorizontal">
                                <strong><IntlMessages id="forms.other-special-cargo" /></strong> : &nbsp; &nbsp; &nbsp;
                              </Label>
                              {quote.special_cargo ? 'Yes':  'No'}
                            </Colxx>
                          </> : '' }
                    </Row>

                    <br/>
                    <Row>
                      <Colxx sm={12}>
                        <Label for="emailHorizontal">
                          <strong><IntlMessages id="forms.notes" /></strong>
                        </Label>
                        <Label for="emailHorizontal" sm={8}>
                          {quote.note}
                        </Label>
                      </Colxx>
                    </Row>

                    <br/>
                    <Row>
                      <Colxx sm="4">
                        <FormGroup row>
                          <Label for="emailHorizontal" sm={4}>
                            <strong><IntlMessages id="forms.rfc" /></strong>
                          </Label>
                          <Label for="emailHorizontal" sm={8}>
                            {getDateWithFormat(new Date(quote.rfc), 'DD-MM-YYYY')}
                          </Label>
                        </FormGroup>
                      </Colxx>
                      <Colxx sm="4">
                        <FormGroup row>
                          <Label for="emailHorizontal" sm={4}>
                            <strong><IntlMessages id="forms.deadline-date" /></strong>
                          </Label>

                          <Label for="emailHorizontal" sm={8}>
                            {getDateWithFormat(new Date(quote.deadline), 'DD-MM-YYYY')}
                          </Label>
                        </FormGroup>
                      </Colxx>
                      <Colxx sm="4" className="text-right">
                        <Button color="primary" className='btn-shadow btn-multiple-state btn btn-primary btn-lg' onClick={(e)=>this.props.history.push('/'+URL_PREFIX+'/agent/quotes/'+quote.slug+'/update')}>
                          Back
                        </Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button color="success" className='btn-shadow btn-multiple-state btn btn-success btn-lg' onClick={(e)=>this.handleSubmit(e)}>
                          Publish
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

export default injectIntl(FormLayoutsUi)