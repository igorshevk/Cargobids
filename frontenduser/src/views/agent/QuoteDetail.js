import { Colxx } from "../../components/common/CustomBootstrap";
import {
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Row,
} from "reactstrap";
import IntlMessages from "../../helpers/IntlMessages";
import { getDateWithFormat } from "../../helpers/Utils";
import { isAgent, isAirline } from "../../helpers/API";
import { Link } from "react-router-dom";
import api from "../../services/api";
import BidList from "../../components/agent/BidList";
import React, { Fragment } from "react";
import { URL_PREFIX } from "../../constants/defaultValues";

class QuoteDetail extends React.Component {
  constructor(props) {
    super(props);
    //         this.state = {
    //      bid_summary:{}
    //        }
  }

  render() {
    const { quote, dimensions, bid_summary } = this.props;
    const bid = quote.bid ? quote.bid : {};

        return <Row>
            <button className="float-right btn-shadow btn-multiple-state btn btn-lg" onClick={()=>window.print()}>
            PDF
            </button>
            <Colxx xl="12" lg="12" className="mb-4">
                <Card className="d-flex mb-3">
                    <CardBody>
                        <div className="row mb-4">
                            <div className="col-sm-6">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <h5
                                        className="card-title mb-2"
                                        style={{
                                        textAlign:"left",
                                        color: "white",
                                        backgroundColor:'red'
                                    }}
                                    >
                                    Titolo: {quote.title}
                                    </h5>
                                    </div>
                                    <div className="col-sm-12 col-md-7">
                                        <ul className="list-unstyled">
                                            <li className="row">
                                            <strong className="col-xs-7"><IntlMessages id="forms.area" /> :</strong>                <span className="col-xs-5">{quote.area}</span></li>
                                            <li className="row"><strong className="col-xs-7"><IntlMessages id="forms.origin" /> :</strong>              <span className="col-xs-5">{quote.origin}</span></li>
                                            <li className="row"><strong className="col-xs-7"><IntlMessages id="forms.destination" /> :</strong>         <span className="col-xs-5">{quote.destination}</span></li>
                                            <li className="row"><strong className="col-xs-7"><IntlMessages id="forms.piece" /> :</strong>               <span className="col-xs-5">{quote.piece}</span></li>
                                            <li className="row"><strong className="col-xs-7"><IntlMessages id="forms.kilo" /> :</strong>                <span className="col-xs-5">{quote.kilo}</span></li>
                                            <li className="row"><strong className="col-xs-7"><IntlMessages id="forms.volume" /> :</strong>              <span className="col-xs-5">{quote.volume}</span></li>
                                            <li className="row"><strong className="col-xs-7"><IntlMessages id="forms.deadline-date" /> :</strong>       <span className="col-xs-5">{getDateWithFormat(new Date(quote.deadline), 'DD-MM-YY')}</span></li>
                                        </ul>
                                    </div>
                                    <div className="col-sm-12 col-md-5">
                                        <ul className="list-unstyled">
                                            <li className="row"><strong className="col-xs-7"><IntlMessages id="forms.general-cargo" /> :</strong>        <span className="col-xs-5">{quote.gencargo ? 'Yes':'No'}</span></li>
                                            <li className="row"><strong className="col-xs-7"><IntlMessages id="forms.stackable" /> :</strong>            <span className="col-xs-5">{quote.stackable ? 'Yes':'No'}</span></li>
                                            <li className="row"><strong className="col-xs-7"><IntlMessages id="forms.tiltable" /> :</strong>             <span className="col-xs-5">{quote.tiltable ? 'Yes':'No'}</span></li>
                                            <li className="row"><strong className="col-xs-7"><IntlMessages id="forms.dgr" /> :</strong>                  <span className="col-xs-5">{quote.dgr ? 'Yes':'No'}</span></li>
                                            <li className="row"><strong className="col-xs-7"><IntlMessages id="forms.perishable" /> :</strong>           <span className="col-xs-5">{quote.perishable ? 'Yes':'No'}</span></li>
                                            <li className="row"><strong className="col-xs-7"><IntlMessages id="forms.other-special-cargo" /> :</strong>  <span className="col-xs-5">{quote.special_cargo ? 'Yes':'No'}</span></li>
                                        </ul>
                                    </div>
                                    <div className="col-sm-12">
                                        <div className="row">
                                            <strong className="col-sm-12">Notes:</strong>
                                            <span className="col-sm-12">{quote.notes ? quote.notes : '---'}</span>
                                        </div>
                                    </div>
                                    {quote.status == 'CLOSED' ?
                                    <div className="col-sm-12 col-md-7">
                                        <ul className="list-unstyled">
                                            <li className="row">
                                                <strong className="col-xs-7"><IntlMessages id="forms.author" /> :</strong>
                                                <span className="col-xs-5">{quote.author ? quote.author.firstname+' '+ quote.author.lastname : ''}</span>
                                            </li>
                                            <li className="row">
                                                <strong className="col-xs-7"><IntlMessages id="forms.company" /> :</strong>
                                                <span className="col-xs-5">{quote.company ? quote.company.agent_company_name : ''}</span>
                                            </li>
                                        </ul>
                                    </div> : ''}
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <Row>
                                    <Colxx md={6} xs={12}>
                                        <strong>Totale Visualizzazioni : {quote.views_count} </strong>
                                    </Colxx>
                                    <Colxx md={6} xs={12}>
                                        <strong>Totale Quotazioni : {quote.total_bids} </strong>
                                    </Colxx>

                                </Row>
                                <br/>
                                {dimensions.length ?
                                    <Row>
                                        <Colxx sm={12}>
                                            <strong><IntlMessages id="forms.inserisci-dimensions" /></strong>
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
                                        <Colxx sm={12}>
                                            <br/>
                                            <Row>
                                                <Colxx md={4} xs={12}>
                                                    <strong>Totale numero colli : {quote.total_pieces} </strong>
                                                </Colxx>
                                                <Colxx md={4} xs={12}>
                                                    <strong>Totale Volume : {quote.net_volume} </strong>
                                                </Colxx>
                                                <Colxx md={4} xs={12}>
                                                    <strong>Chargeable Weight : {quote.chargeable_weight} </strong>
                                                </Colxx>
                                            </Row>
                                        </Colxx>
                                    </Row> : ''}
                            </div>
                        </div>
                        {isAirline() ?
                            <div className="row">
                                {quote.status !== 'CLOSED' ? <div className="col-sm-12 col-md-4"><Link to={"/"+URL_PREFIX+"/airline/ask"} className="btn btn-sm btn-primary">INVIA UNA DOMANDA</Link></div>:''}
                                {!quote.bid ?
                                    (quote.status !== 'CLOSED' ? <div className="col-sm-12 col-md-4"><Link to={"/"+URL_PREFIX+"/airline/quotes/"+quote.id+"/bids/make"} className="btn btn-sm btn-success">INVIA QUOTAZIONE</Link></div> : '')
                                    :
                                    ''
                                }
                                <div className="col-sm-12 col-md-4"><Link to={"/"+URL_PREFIX+"/airline/quotes"} className="btn btn-sm btn-danger">BACK TO LIST</Link></div>
                            </div>
                            :''}
                    </CardBody>
                </Card>
                {isAirline() ?
                <Card className="d-flex mb-3">
                    <CardBody>
                        <Form>
                            <Row>
                                <Label for="emailHorizontal" sm={6}>
                                    <h4>La Tua Quotazione</h4>
                                </Label>
                            </Row>
                            <Row>
                                <Colxx sm={6} md={4} >
                                    <FormGroup row>
                                        <Label for="emailHorizontal" sm={4}>
                                            <strong>QUOTE</strong>
                                        </Label>
                                        <Label for="emailHorizontal" sm={8}>
                                            {quote.title}
                                        </Label>
                                    </FormGroup>
                                </Colxx>
                                <Colxx sm={6} md={4} >
                                    <FormGroup row>
                                        <Label for="emailHorizontal" sm={4}>
                                            <strong><IntlMessages id="forms.carrier" /></strong>
                                        </Label>
                                        <Label for="emailHorizontal" sm={8}>
                                            {bid.carrier}
                                        </Label>
                                    </FormGroup>
                                </Colxx>
                                <Colxx sm={6} md={4}>
                                    <FormGroup row>
                                        <Label for="emailHorizontal" sm={4}>
                                            <strong><IntlMessages id="forms.rate" /></strong>
                                        </Label>
                                        <Label for="emailHorizontal" sm={8}>
                                            {bid.rate}
                                        </Label>
                                    </FormGroup>
                                </Colxx>

                            </Row>
                            <Row>
                                <Colxx sm={6} md={4}>
                                    <FormGroup row>
                                        <Label for="emailHorizontal" sm={4}>
                                            <strong><IntlMessages id="forms.all_in" /></strong>
                                        </Label>
                                        <Label for="emailHorizontal" sm={8}>
                                            {bid.all_in}
                                        </Label>
                                    </FormGroup>
                                </Colxx>
                                <Colxx sm={6} md={4}>
                                    <FormGroup row>
                                        <Label for="emailHorizontal" sm={4}>
                                            <strong><IntlMessages id="forms.surcharges" /></strong>
                                        </Label>
                                        <Label for="emailHorizontal" sm={8}>
                                            {bid.surcharges}
                                        </Label>
                                    </FormGroup>
                                </Colxx>
                                <Colxx sm={6} md={4}>
                                    <FormGroup row>
                                        <Label for="emailHorizontal" sm={4}>
                                            <strong><IntlMessages id="forms.cw_required" /></strong>
                                        </Label>
                                        <Label for="emailHorizontal" sm={8}>
                                            {bid.cw_required}
                                        </Label>
                                    </FormGroup>
                                </Colxx>

                            </Row>
                            <Row>
                                <Colxx sm={6} md={4}>
                                    <FormGroup row>
                                        <Label for="emailHorizontal" sm={4}>
                                            <strong><IntlMessages id="forms.origine" /></strong>
                                        </Label>
                                        <Label for="emailHorizontal" sm={8}>
                                            {bid.origin}
                                        </Label>
                                    </FormGroup>
                                </Colxx>
                                <Colxx sm={6} md={4}>
                                    <FormGroup row>
                                        <Label for="emailHorizontal" sm={4}>
                                            <strong><IntlMessages id="forms.conditions" /></strong>
                                        </Label>
                                        <Label for="emailHorizontal" sm={8}>
                                            {bid.conditions}
                                        </Label>
                                    </FormGroup>
                                </Colxx>
                                <Colxx sm={6} md={4} >
                                    <FormGroup row>
                                        <Label for="emailHorizontal" sm={4}>
                                            <strong>PUBBLICA</strong>
                                        </Label>
                                        <Label for="emailHorizontal" sm={8}>
                                            {bid.publish}
                                        </Label>
                                    </FormGroup>
                                </Colxx>
                            </Row>
                            <Row>
                                <Colxx sm={6} md={4}>
                                    <FormGroup row>
                                        <Label for="emailHorizontal" sm={4}>
                                            <strong>STATUS</strong>
                                        </Label>
                                        <Label for="emailHorizontal" sm={8}>
                                            {bid.status}
                                        </Label>
                                    </FormGroup>
                                </Colxx>
                                <Colxx sm={6} md={4}>
                                    <FormGroup row>
                                        <Label for="emailHorizontal" sm={4}>
                                            <strong><IntlMessages id="forms.remarks" /></strong>
                                        </Label>
                                        <Label for="emailHorizontal" sm={8}>
                                            {bid.remarks}
                                        </Label>
                                    </FormGroup>
                                </Colxx>
                            </Row>
                        </Form>
                    </CardBody>
                </Card>:""}
                <Card className="d-flex mb-3">
                    <CardBody>
                        <div className="row mb-4">
                            <div className="col-sm-12">
                                 <h5 className="card-title mb-2" style={{textAlign:"left",color: "white",backgroundColor:'Darkred'
                                }}>SOMMARIO:</h5>
                            </div>
                            <div className="col-sm-12">
                                <span>Numero di quotazioni ricevute:  {bid_summary.total_bids}</span>
                               <ul>
                                  <li>{bid_summary.bid_have_rate}  quotazioni all in;</li>
                                  <li>{bid_summary.bid_without_surcharges} quotazioni con
                      tariffa + addizionali;</li>
                                  <li>{bid_summary.bid_have_origin} quotazioni con aeroporto di
                      origine: (origin)</li>
                                  <li>{bid_summary.bid_require_CW} quotazioni con CW maggiorato
                      richiesto;</li>
                                  <li>La tua quotazione posizionata :
                                    {quote.ranked >= 1 && quote.ranked <=3 ? ' Tra le prime 3 migliori quotazioni':''}
                                    {quote.ranked >= 4 && quote.ranked <=7 ? ' Tra la quarta e settima migliore quotazione':''}
                                    {quote.ranked >= 8 ? ' Non rientra tra le prime 7':''}
                                  </li>
                                </ul>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Colxx>

            <Colxx xl="12" lg="12" className="mb-4">
              {isAgent() ? <BidList /> : ""}
            </Colxx>
      </Row>
  }
}
export default QuoteDetail;