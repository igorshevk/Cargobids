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
import {STATUS_CHOICES, TYPES, TYPES_CHOICES, ORIGIN_CHOICES, AREA_CHOICES, DROPDOWN_WAIT, loadOptions} from '../../helpers/API';
import {addDaysToDate, makeDbFormat, sendError} from '../../helpers/Utils';

import { URL_PREFIX } from '../../constants/defaultValues';

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
      tooltipOpen:false,
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
        destination:'',
        kilos:0,
        gencargo:true,
        dgr:false,
        perishable:false,
        stackable:true,
        tiltable:true,
        special_cargo:false,
        chargeable_weight:0,
        net_volume:0,
        note:'',
        total_pieces:0,
        deadline:addDaysToDate(new Date(), 15)
      },
      airports:[],
      selected_destination:{},
      selected_area:{},
      selected_origin:{},
      selected_types:{},
      modelsLoaded: false,
      airport:'',
      dimensions:[]
    };

    // this.getAirports();
    this.toggle = this.toggle.bind(this);
  }

  getAirports() {
    api.getAirports('',(err, response)=>{
      let airports = [];
      response.data.map((airport, i) => {
          airports.push({value:airport[4], label:`${airport[1]}(${airport[4]}), ${airport[2]}, ${airport[3]}`});
      })
      this.setState({airports:airports, modelsLoaded: true});
    })
  }

  getAirport(code) {
    if(code.length > 2) {
      api.getAirport(code,(err, response)=>{
        if(response.data.length)
          this.setState({airport:`${response.data[1]}, ${response.data[2]}`});
        else {
          this.setState({airport:''});
        }
      })
    }
  }

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }

  handleTagChange = tags => {
    this.setState({ tags });
  };

  handleTagChangeLabelOver = tagsLabelOver => {
    this.setState({ tagsLabelOver });
  };

  handleTagChangeLabelTop = tagsLabelTop => {
    this.setState({ tagsLabelTop });
  };

  handleChangeLabelOver = selectedOptionLabelOver => {
    this.setState({ selectedOptionLabelOver });
  };

  handleChangeLabelTop = selectedOptionLabelTop => {
    this.setState({ selectedOptionLabelTop });
  };

  handleChangeDateLabelOver = date => {
    this.setState({
      startDateLabelOver: date
    });
  };

  handleChangeDateLabelTop = date => {
    this.setState({
      startDateLabelTop: date
    });
  };

  addDimension = () => {
    let dimensions = this.state.dimensions;
    dimensions.push(this.state.dimension);
    this.setState({dimensions:dimensions});
    this.generateOutput(dimensions);
  }

  removeDimension = () => {
    let dimensions = this.state.dimensions;
    dimensions.pop();
    this.setState({dimensions:dimensions})
    this.generateOutput(dimensions);
  }

  generateOutput = (newDimensions) => {
    let net_volume = 0, total_pieces = 0;
    newDimensions.map((dimension, i) => {
      net_volume += parseFloat(dimension.cbm);
      total_pieces += parseInt(dimension.colli);
    })


    let chargeable = net_volume / 6000;

    if(chargeable < this.state.quote.kilos)
      chargeable = this.state.quote.kilos

    let quote = this.state.quote;
    quote.chargeable_weight = parseInt(chargeable).toFixed(2);
    quote.net_volume = (net_volume / 1000000).toFixed(2);
    quote.total_pieces = total_pieces;
    quote.volume = quote.net_volume;
    quote.weight = quote.chargeable_weight;

    this.setState({quote:quote});
  }

  changeDimension = (e, index) => {
    
    let newDimensions = this.state.dimensions.map((dimension,i) => {
      let newdimension = {};

      Object.keys(dimension).map((key)=> {
        if(i === index && key === e.target.name)
          newdimension[key] = e.target.value;
        else
          newdimension[key] = dimension[key];
      })

      newdimension.cbm = ((newdimension.colli * newdimension.length * newdimension.width * newdimension.height)).toFixed(2);


      return newdimension;
    });

    // if(e.target.name === 'colli' && 'pieces' in this.state.quote && this.state.quote.pieces !== '')

    this.setState({dimensions:newDimensions});

    this.generateOutput(newDimensions);
  }

  checkPiecesValid = (e) => {
    if(this.state.dimensions.length) {
      try {
        if(parseInt(this.state.quote.total_pieces) !== parseInt(this.state.quote.pieces)) {
          errorNoti('Verifica correttezza Numero Colli');
          return false;
        }
      } catch(e) {
        errorNoti('Il numero totale colli non coincide');
        return false;
      }
    }
    return true;
  }

  changeHandler = (e) => {
    let quote = this.state.quote;
    quote[e.target.name] = e.target.value;
    this.setState({quote:quote});

    if(e.target.name === 'destination')
      this.getAirport(e.target.value);
    else if(e.target.name === 'kilos' && this.state.dimensions.length)
      this.generateOutput(this.state.dimensions);
    /*else if(e.target.name === 'pieces') {
      if(this.state.dimensions.length > 0)
        this.checkPiecesValid(e, quote.total_pieces)
    }*/
  }

  blurHandler = (e) => {
    let quote = this.state.quote;
    if(e.target.name === 'kilos' || e.target.name === 'volume' || e.target.name === 'weight')
      quote[e.target.name] = e.target.value ? parseFloat(e.target.value).toFixed(2) : e.target.value;
    else
      quote[e.target.name] = e.target.value;

    if(e.target.name === 'kilos' && this.state.dimensions.length)
      this.generateOutput(this.state.dimensions);

    if(e.target.name === 'weight') {
      if(parseFloat(e.target.value) < parseFloat(this.state.quote.kilos)) {
        quote.weight = this.state.quote.kilos;
        errorNoti("CW cannot be lower than Peso");
      }
    }

    if(e.target.name === 'destination') {
      if(this.state.airport === '')
        errorNoti('This doesn’t seem to be a correct Airport code.Are you sure you entered an airport code, and not city code?');
    }


    this.setState({quote:quote});
  }

  selectChanged(value, key) {
    let quote = this.state.quote;
    quote[key] = value.value

    this.setState({['selected_'+key]:value, quote: quote});
  };

  dateHandler(value, key) {
    console.log(value);
    let quote = this.state.quote;
    quote[key] = value;
    this.setState({quote: quote});
  }

  handleRadio = (e, value) => {
    let quote = this.state.quote;
    quote[e.target.name] = value;
    this.setState({quote:quote});
  }

  handleSubmit = (e) => {
    let quote = this.state.quote;
    // quote.weight = quote.chargeable_weight;
    quote.dimensions = JSON.stringify(this.state.dimensions);

    if(quote.gencargo) {
      quote.dgr = false;
      quote.perishable = false;
      quote.special_cargo = false;
    }
    quote = makeDbFormat(quote, ['deadline', 'rfc']);
    if(!this.checkPiecesValid(e, this.state.quote.pieces))
      return false;

    if(parseFloat(quote.weight) < parseFloat(quote.chargeable_weight))
      quote.weight = quote.chargeable_weight;

    api.createQuote(quote,(response)=>{
      if('id' in response)
        this.props.history.push('/'+URL_PREFIX+'/agent/quotes/'+response.slug+'/review')
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
            <h1 style={{ 
              textAlign:"left",
              color: "#8467d7",
              }}><IntlMessages id="quote.create" /></h1>
            <Separator className="mb-5" />
          </Colxx>
        </Row>

        <Row className="mb-4">
          <Colxx xxs="12">
            <Card>
              <CardBody>
                <Form className="quote-form">
                  <Row>
                    <Colxx sm="6">
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={2}>
                          <CardTitle><IntlMessages id="forms.title" /> *</CardTitle>
                        </Label>
                        <Colxx sm={10}>
                          <Input
                            type="text"
                            name="title"
                            className="border-dark"
                            value={quote.title}
                            onChange={(e) => this.changeHandler(e)}
                            placeholder={messages["forms.title"]}
                          />
                        </Colxx>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm="6">
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={2}>
                          <IntlMessages id="forms.types" />
                        </Label>
                        <Colxx sm={10}>
                          <Select
                              className="react-select border-dark"
                              classNamePrefix="react-select"
                              name="form-field-name"
                              value={this.state.selected_types}
                              onChange={(e) => this.selectChanged(e, 'types')}
                              options={TYPES_CHOICES}
                              placeholder={messages["forms.types"]}
                          />
                        </Colxx>
                      </FormGroup>
                    </Colxx>
                  </Row>
                  <Row>
                    <Colxx sm={6} md={3} >
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4}>
                          <IntlMessages id="forms.area" /> *
                        </Label>
                        <Colxx sm={8}>
                          <Select
                              className="react-select border-dark"
                              classNamePrefix="react-select"
                              name="form-field-name"
                              value={this.state.selected_area}
                              onChange={(e) => this.selectChanged(e, 'area')}
                              options={AREA_CHOICES}
                              placeholder={messages["forms.area"]}
                          />
                        </Colxx>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={3}>
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4}>
                          <IntlMessages id="forms.origin" /> *
                        </Label>
                        <Colxx sm={8}>
                          <Select
                            className="react-select border-dark"
                            classNamePrefix="react-select"
                            name="form-field-name"
                            value={this.state.selected_origin}
                            onChange={(e) => this.selectChanged(e, 'origin')}
                            options={ORIGIN_CHOICES}
                            placeholder={messages["forms.origin"]}
                          />
                        </Colxx>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6}>
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4} md={3}>
                          <IntlMessages id="forms.destination" /> *
                        </Label>
                        <Colxx sm={7} md={4}>
                          <Input
                            className="border-dark"
                              name="destination"
                              value={quote.destination.toUpperCase()}
                              placeholder={messages["forms.destination"]}
                              onChange={(e) => this.changeHandler(e)}
                              onBlur={(e) => this.blurHandler(e)}
                            />
                        </Colxx>
                        <Colxx sm={12} md={5}>
                            <Label for="emailHorizontal">
                              {airport}
                            </Label>
                        </Colxx>
                      </FormGroup>
                    </Colxx>
                  </Row>
                  <Row>
                    <Colxx sm={6} md={3}>
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4}>
                          <IntlMessages id="forms.piece" /> *
                        </Label>
                        <Colxx sm={8}>
                          <Input
                            className="border-dark"
                            type="number"
                            name="pieces"
                            value={quote.pieces}
                            placeholder={messages["forms.piece"]}
                            onChange={(e) => this.changeHandler(e)}
                          />
                        </Colxx>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6} md={3}>
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4}>
                          <IntlMessages id="forms.kilo" /> *
                        </Label>
                        <Colxx sm={8}>
                          <Input
                            className="border-dark"
                            type="number"
                            name="kilos"
                            value={quote.kilos}
                            placeholder={messages["forms.kilo"]}
                            onBlur={(e) => this.blurHandler(e)}
                            onChange={(e) => this.changeHandler(e)}
                          />
                        </Colxx>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm={6}>
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4} md={3}>
                          <IntlMessages id="forms.volume" />
                        </Label>
                        <Colxx sm={7} md={4}>
                          <Input
                              className="border-dark"
                              type="number"
                              name="volume"
                              value={quote.volume}
                              placeholder={messages["forms.volume"]}
                              onBlur={(e) => this.blurHandler(e)}
                              onChange={(e) => this.changeHandler(e)}
                          />
                        </Colxx>
                      </FormGroup>
                    </Colxx>
                  </Row>
                  <Row>
                    <Colxx sm={6} md={3}>
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4}>
                          <IntlMessages id="forms.cw" />
                        </Label>
                        <Colxx sm={8}>
                          <Input
                            className="border-dark"
                            type="number"
                            name="weight"
                            value={quote.weight}
                            placeholder={messages["forms.cw"]}
                            onBlur={(e) => this.blurHandler(e)}
                            onChange={(e) => this.changeHandler(e)}
                          />
                        </Colxx>
                      </FormGroup>
                    </Colxx>
                  </Row>
                  <Row>
                    <Colxx sm={6} md={3}>
                    <CardTitle><IntlMessages id="forms.inserisci-dimensions" /></CardTitle>
                    </Colxx>
                    <Colxx sm={6} md={8}>
                        <button type="button" onClick = {() => this.addDimension()} className="btn btn-info btn-shadow btn-lg mr-2">Add </button>&nbsp;
                        {dimensions.length ?<button type="button" onClick = {() => this.removeDimension()} className="btn-shadow btn-lg btn btn-danger">Remove</button>:''}
                    </Colxx>
                    {dimensions.length ?
                    <>
                    <Colxx sm={12}>
                       <table id="cubic_table" className="calculation-table table table-bordered">
                          <thead>
                          <tr className="">
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
                            <td>
                                <Input
                            className="border-dark"
                                type="number"
                                name="colli"
                                value={dimension.colli}
                                onChange={(e) => this.changeDimension(e, i)}
                              />
                            </td>
                            <td>
                                <Input
                            className="border-dark"
                                type="number"
                                name="length"
                                value={dimension.length}
                                onChange={(e) => this.changeDimension(e, i)}
                              />
                            </td>
                            <td>
                              <Input
                            className="border-dark"
                                type="number"
                                name="width"
                                value={dimension.width}
                                onChange={(e) => this.changeDimension(e, i)}
                              />
                            </td>
                            <td >
                              <Input
                            className="border-dark"
                                type="number"
                                name="height"
                                value={dimension.height}
                                onChange={(e) => this.changeDimension(e, i)}
                              />
                            </td>
                            <th scope="row" style={{width:'20%'}} class="table_0">{(dimension.cbm / 1000000).toFixed(2)}</th>
                          </tr>
                          })}
                          </tbody>
                        </table>
                    </Colxx>
                    <Colxx sm={12}>
                      <br/>
                      <Row>
                        <Colxx md={4} xs={12}>
                          <h6 style={{color:"red"}}><strong>TOTALE COLLI : {quote.total_pieces} </strong></h6>
                        </Colxx>
                        <Colxx md={4} xs={12}>
                          <h6 style={{color:"red"}}><strong>TOTALE VOLUME: {quote.net_volume} </strong></h6>
                        </Colxx>
                        <Colxx md={4} xs={12}>
                          <h6 style={{color:"red"}}><strong>CHARGEABLE WEIGHT: {quote.chargeable_weight} </strong></h6>
                        </Colxx>
                      </Row>
                    <br/> <br/>
                    </Colxx></> : ''}
                  </Row>
                  <Row>
                    <Colxx sm={4} md={2} xs={6}>
                        <Label for="emailHorizontal">
                          <IntlMessages id="forms.general-cargo" />
                        </Label>
                        <FormGroup row>
                          <Colxx sm={4} >
                              <CustomInput
                                type="radio"
                                id="exCustomRadio"
                                name="gencargo"
                                label="Yes"
                                checked={quote.gencargo}
                                onChange={(e) => this.handleRadio(e, true)}
                              />
                          </Colxx>
                          <Colxx sm={4}>
                              <CustomInput
                                id="gencargo1"
                                type="radio"
                                name="gencargo"
                                label="No"
                                checked={!quote.gencargo}
                                onChange={(e) => this.handleRadio(e, false)}
                              />
                          </Colxx>
                        </FormGroup>
                    </Colxx>

                    <Colxx sm={4} md={2} xs={6}>
                        <Label for="emailHorizontal">
                          <IntlMessages id="forms.stackable" />
                        </Label>
                        <FormGroup row>
                          <Colxx sm={4}>
                              <CustomInput
                                id="stackable1"
                                type="radio"
                                name="stackable"
                                label="Yes"
                                checked={quote.stackable}
                                onChange={(e) => this.handleRadio(e, true)}
                              />
                          </Colxx>
                          <Colxx sm={4}>
                              <CustomInput
                                id="stackable2"
                                type="radio"
                                name="stackable"
                                label="No"
                                checked={!quote.stackable}
                                onChange={(e) => this.handleRadio(e, false)}
                              />
                          </Colxx>
                        </FormGroup>
                    </Colxx>

                    <Colxx sm={4} md={2} xs={6}>
                        <Label for="emailHorizontal">
                          <IntlMessages id="forms.tiltable" />
                        </Label>
                        <FormGroup row>
                          <Colxx sm={4}>
                              <CustomInput
                                id="tiltable1"
                                type="radio"
                                name="tiltable"
                                label="Yes"
                                checked={quote.tiltable}
                                onChange={(e) => this.handleRadio(e, true)}
                              />
                          </Colxx>
                          <Colxx sm={4}>
                              <CustomInput
                                id="tiltable2"
                                type="radio"
                                name="tiltable"
                                label="No"
                                checked={!quote.tiltable}
                                onChange={(e) => this.handleRadio(e, false)}
                              />
                          </Colxx>
                        </FormGroup>
                    </Colxx>
                    {!quote.gencargo ?
                    <>
                    <Colxx sm={4} md={2} xs={6}>
                        <Label for="emailHorizontal">
                          <IntlMessages id="forms.dgr" />
                        </Label>
                        <FormGroup row>
                          <Colxx sm={4}>
                              <CustomInput
                                id="dgr1"
                                type="radio"
                                name="dgr"
                                label="Yes"
                                checked={quote.dgr}
                                onChange={(e) => this.handleRadio(e, true)}
                              />
                          </Colxx>
                          <Colxx sm={4}>
                              <CustomInput
                                id="dgr2"
                                type="radio"
                                name="dgr"
                                label="No"
                                checked={!quote.dgr}
                                onChange={(e) => this.handleRadio(e, false)}
                              />
                          </Colxx>
                        </FormGroup>
                    </Colxx>

                    <Colxx sm={4} md={2} xs={6}>
                        <Label for="emailHorizontal">
                          <IntlMessages id="forms.perishable" />
                        </Label>
                        <FormGroup row>
                          <Colxx sm={4}>
                              <CustomInput
                                id="perishable1"
                                type="radio"
                                name="perishable"
                                label="Yes"
                                checked={quote.perishable}
                                onChange={(e) => this.handleRadio(e, true)}
                              />
                          </Colxx>
                          <Colxx sm={4}>
                              <CustomInput
                                id="perishable2"
                                type="radio"
                                name="perishable"
                                label="No"
                                checked={!quote.perishable}
                                onChange={(e) => this.handleRadio(e, false)}
                              />
                          </Colxx>
                        </FormGroup>
                    </Colxx>

                    <Colxx sm={4} md={2} xs={6}>
                        <Label for="emailHorizontal">
                          <IntlMessages id="forms.other-special-cargo" />
                        </Label>
                        <FormGroup row>
                          <Colxx sm={4}>
                              <CustomInput
                                type="radio"
                                id="special_cargo1"
                                name="special_cargo"
                                label="Yes"
                                checked={quote.special_cargo}
                                onChange={(e) => this.handleRadio(e, true)}
                              />
                          </Colxx>
                          <Colxx sm={4}>
                              <CustomInput
                                type="radio"
                                id="special_cargo2"
                                name="special_cargo"
                                label="No"
                                checked={!quote.special_cargo}
                                onChange={(e) => this.handleRadio(e, false)}
                              />
                          </Colxx>
                        </FormGroup>
                    </Colxx>
                    </> : '' }
                  </Row>

                  <Row>
                    <Colxx sm={12}>
                        <Label for="emailHorizontal">
                          <IntlMessages id="forms.notes" />
                        </Label>
                        <FormGroup row>
                          <Colxx sm={12}>
                              <Input type="textarea"
                            className="border-dark" name="note" onChange={(e) => this.changeHandler(e)} rows="3"
                                value={quote.note} />
                          </Colxx>
                        </FormGroup>
                    </Colxx>
                  </Row>

                  <Row>
                    <Colxx sm="4">
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4}>
                          <IntlMessages id="forms.rfc" />
                        </Label>
                        <Colxx sm={8}>
                            <DatePicker
                              className="border-dark"
                              dateFormat="DD-MM-YYYY"
                              selected={quote.rfc ? moment(quote.rfc) : null}
                              onChange={(v) => this.dateHandler(v, 'rfc')}
                            />
                        </Colxx>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm="4">
                      <FormGroup row>
                        <Label for="emailHorizontal" sm={4}>
                          <IntlMessages id="forms.deadline-date" />  &nbsp;
                          <i id="Tooltipdeadline" className="fa fa-question-circle" aria-hidden="true"></i>
                          <Tooltip
                            placement="right"
                            isOpen={this.state.tooltipOpen}
                            target="Tooltipdeadline"
                            toggle={this.toggle}
                          >
                          <IntlMessages id="forms.deadline_tooltip" />
                            </Tooltip>
                        </Label>

                        <Colxx sm={7}>
                            <DatePicker
                              className="border-dark"
                              minDate={new Date()}
                              maxDate={quote.deadline}
                              dateFormat="DD-MM-YYYY"
                              selected={quote.deadline ? moment(quote.deadline) : null}
                              onChange={(v) => this.dateHandler(v, 'deadline')}
                            />
                        </Colxx>
                      </FormGroup>
                    </Colxx>
                    <Colxx sm="4">
                        <Button color="primary" onClick={(e)=>this.handleSubmit(e)} className="float-right btn-shadow btn-multiple-state btn btn-primary mr-2 btn-lg">
                          <IntlMessages id="forms.avanti" />
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