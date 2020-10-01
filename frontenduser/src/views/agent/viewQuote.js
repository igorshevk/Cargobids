import React, { Component, Fragment } from "react";
import { Question_URL, API_URL } from "../../helpers/Auth";
import { getConfig } from "../../helpers/API";
import {
  Row,
  CardTitle,
  Tooltip,
  Card as div,
  CardBody,
  Form,
  ModalHeader,
  ModalBody,
  Modal,
  ModalFooter,
  Label,
  FormGroup,
  Input,
  Button,
  ButtonGroup,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
} from "reactstrap";
import axios from "axios";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import { Colxx } from "../../components/common/CustomBootstrap";
import { injectIntl } from "react-intl";
import BidList from "../../components/agent/BidList";
import IntlMessages from "../../helpers/IntlMessages";
import api from "../../services/api";
import { getDateWithFormat } from "../../helpers/Utils";
import {
  STATUS_CHOICES,
  TYPES,
  ORIGIN_CHOICES,
  AREA_CHOICES,
  TYPES_CHOICES,
  DROPDOWN_WAIT,
  loadOptions,
  isAgent,
  isAirline,
  getUser,
  CONDITIONS_CHOICES,
  All_IN,
} from "../../helpers/API";
import { Link } from "react-router-dom";
import { errorNoti, successNoti } from "../../helpers/Notifications";
import { sendError } from "../../helpers/Utils";
import QuoteDetail from "./QuoteDetail";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import { URL_PREFIX } from "../../constants/defaultValues";
import { PusherContext } from "../../context";

const customStyles = {
  content: {
    padding: "20px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const headerStyle = {
  borderBottom: "1px solid #ccc",
  paddingBottom: "15px",
  marginBottom: "30px",
};

const inputStyle = {
  // width: "300px",
  marginBottom: "1rem",
};

class ViewQuote extends Component {
  static contextType = PusherContext;
  constructor(props) {
    super(props);
    this.state = {
      bidData: [],
      pdfReady: false,
      nestingDropdownOpen: false,

      loaded: false,
      bid_carriers: {},
      quote: {
        kilos: 0,
        gencargo: true,
        dgr: false,
        perishable: false,
        stackable: true,
        tiltable: true,
        special_cargo: false,
        chargeable_weight: 0,
        net_volume: 0,
        note: "",
        total_pieces: 0,
        id: null,
        user_all_bids: 0
      },
      questions: [],
      bid_summary: {
        bid_with_rate: 0,
        bid_without_surcharges: 0,
        bid_have_origin: 0,
        bid_req_cw_required: 0,
        bid_have_origin: 0,
        bid_have_condition: 0,
      },
      airport: "",
      dimensions: [],
      action: "",
      bidToBeDeleted: null,
      tooltipOpen: false,
      tooltipOpen2: false,
      tooltipOpen3: false,
      tooltipOpen4: false,
      tooltipOpen5: false,

      modalIsOpen: false,
    };

    this.getQuote(this.props.match.params.id);
    this.getQuoteQuestions(this.props.match.params.id);
    this.toggle = this.toggle.bind(this);
    this.toggle2 = this.toggle2.bind(this);
    this.toggle3 = this.toggle3.bind(this);
    this.toggle4 = this.toggle4.bind(this);
    this.toggle5 = this.toggle5.bind(this);
  }

  nestingToggle = () => {
    this.setState({
      nestingDropdownOpen: !this.state.nestingDropdownOpen,
    });
  };

  // componentWillUpdate(prevProps, prevState) {
  //   if (prevState.quote.id && !this.state.quote.id){
  //       const pusher = this.context
  //       const channelName = 'agent'+prevState.quote.id
  //       let channel = pusher.channel(channelName);
  //       if (!channel){
  //         channel = pusher.subscribe(channelName);
  //       }
  //       channel.bind('bid'+prevState.quote.id, function(data) {
  //         console.log(data)
  //         this.getQuote(this.props.match.params.id, true);
  //       }.bind(this));
  //   }
  // }

  // componentWillUnmount() {
  //   const pusher = this.context
  //   const channelName = 'agent'+ this.props.match.params.id
  //   let channel = pusher.channel(channelName);
  //   if (!channel){
  //     channel = pusher.subscribe(channelName);
  //   }
  //   channel.unbind_all()
  // }

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    });
  }

  getBidSummary(bid_id) {
    api.getBidSummary(bid_id, (err, response) => {
      this.setState({ bid_summary: response });
    });
  }
  toggle2 = () => {
    this.setState({
      tooltipOpen2: !this.state.tooltipOpen2,
    });
  };
  toggle3 = () => {
    this.setState({
      tooltipOpen3: !this.state.tooltipOpen3,
    });
  };
  toggle4 = () => {
    this.setState({
      tooltipOpen4: !this.state.tooltipOpen4,
    });
  };

  toggle5() {
    this.setState({
      tooltipOpen5: !this.state.tooltipOpen5,
    });
  }

  getQuoteQuestions(id) {
    const config = getConfig();
    axios.get(API_URL + `get_quote_questions/${id}/`, config).then(
      (res) => {
        this.setState({ questions: res.data });
      },
      (err) => { }
    );
  }
  getQuote(quote_id, update) {
    api.getQuote(quote_id, (err, response) => {
      if (update) {
        // retreive the bids again
        this.setState({ quote: { ...this.state.quote, bids: response.bids } });
        return null;
      }
      if (response === undefined) {
        if (isAgent())
          this.props.history.push("/" + URL_PREFIX + "/agent/dashboard");
        else this.props.history.push("/" + URL_PREFIX + "/airline/dashboard");

        return false;
      }
      if (response.bid["id"]) {
        this.getBidSummary(response.bid["id"]);
      }
      this.updateQuoteCount(response);
    });
  }

  closeQuote = () => {
    let quote = this.state.quote;
    this.closeModal();
    api.closeQuote({ slug: quote.slug, status: "CLOSED" }, (err, response) => {
      if ("id" in response) {
        successNoti("L'inserzione è stata chiusa.");
        this.props.history.push(`/${URL_PREFIX}/agent/quotes`);
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

  closeModal = () => {
    this.setState({ modalIsOpen: false, action: "" });
  };

  onInputChange = (e) => {
    this.setState({ question: e.target.value });
  };

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  sendMessage = () => {
    if (!this.state.question) {
      errorNoti("Inserisci la tua domanda!");
    } else {
      this.setState({ sendMessagePending: true }, () => {
        const values = {
          quote: this.state.quote.id,
          content: this.state.question,
        };
        const config = getConfig();
        axios.post(Question_URL, values, config).then(
          (res) => {
            successNoti("La tua domanda é stata inviata con successo!");
            this.setState({ modalIsOpen: false });
            this.setState({ sendMessagePending: false, question: "" });
          },
          (err) => {
            errorNoti("Something went wrong try again please");
            this.setState({ sendMessagePending: false });
          }
        );
      });
    }
  };

  deleteBid(bid_id) {
    let url = "bids/" + bid_id + "/";
    this.closeModal();
    api.patch(url, { status: "DELETED" }, (err, response) => {
      let quote = this.state.quote;
      let bids = quote.bids.filter((bid) => bid.id != bid_id);
      quote.bids = bids;
      quote.user_bids -= 1;
      this.setState({ quote: quote });
      successNoti("La tua quotazione è stata cancellata con successo.");
    });
  }

  getCarrier(bids) {
    bids.map((bid, index) => {
      api.list("carriers/" + bid.carrier + "/", {}, (err, response) => {
        let bid_carriers = this.state.bid_carriers;
        bid_carriers[bid.id] = response.data;
        this.setState({ bid_carriers: bid_carriers });
      });
    });
  }

  updateQuoteCount = (quote) => {
    api.updateQuoteCount(
      { slug: quote.slug, updateCount: true },
      (err, response) => {
        if ("id" in response) {
          response.bid = quote.bid;
          response.total_bids = quote.total_bids;
          response.author = quote.author;
          response.company = quote.company;
          response.airport = quote.airport;
          response.user_bids = quote.user_bids;
          response.user_all_bids = quote.bids.length;

          response.bids = quote.bids.filter((bid) => bid.status !== "DELETED");

          this.setState({ quote: response }, () =>
            this.getCarrier(response.bids)
          );

          AREA_CHOICES.map((area) => {
            if (area.value === response.area) response.area = area.label;
          });
          ORIGIN_CHOICES.map((origin) => {
            if (origin.value === response.origin)
              response.origin = origin.label;
          });
          TYPES_CHOICES.map((type) => {
            if (type.value === response.types) response.types = type.label;
          });
          let dimensions = JSON.parse(response.dimensions);
          this.setState({
            dimensions: dimensions,
            quote: response,
            loaded: true,
          });
          this.generateOutput(dimensions);
        }
      }
    );
  };

  generateOutput = (newDimensions) => {
    let net_volume = 0,
      total_pieces = 0;
    newDimensions.map((dimension, i) => {
      net_volume += parseFloat(dimension.cbm);
      total_pieces += parseInt(dimension.colli);
    });

    let chargeable = net_volume / 6000;
    let weight = parseInt(this.state.quote.kilos);
    if (chargeable < this.state.quote.kilos)
      chargeable = this.state.quote.kilos;

    let quote = this.state.quote;
    quote.chargeable_weight = parseInt(chargeable).toFixed(2);
    quote.net_volume = (net_volume / 1000000).toFixed(2);
    quote.total_pieces = total_pieces;

    if (parseFloat(quote.weight) < quote.chargeable_weight)
      quote.final_weight = quote.chargeable_weight;
    else quote.final_weight = quote.weight;
    this.setState({ quote: quote });
  };

  fetchData() {
    // we are fetching these data only to use in pdf export, nowhere else used these fetched data
    this.setState({ loading: true });
    let params = {
      format: "datatables",

      // page: state.page + 1
    };

    params["quote"] = this.state.quote.id;
    params["ordering"] = "";

    // We are fetching these data only to use in pdf.
    api.list("bids", params, (err, res) => {
      this.setState({
        bidData: res.data.map((d) => [
          d.carrier,
          d.rate,
          d.surcharges,
          d.cw_required,
          d.status,
          d.author.firstname + d.author.lastname,
          d.author.email,
        ]),
        pdfReady: true,
      });
    });
  }

  render() {
    const {
      dimensions,
      quote,
      bid_summary,
      loaded,
      bid_carriers,
      action,
      bidToBeDeleted,
    } = this.state;
    const bid = quote.bid ? quote.bid : {};

    CONDITIONS_CHOICES.map((condition) => {
      if (condition.value === bid.conditions) bid.conditions = condition.label;
    });
    All_IN.map((al_in) => {
      if (al_in.value === bid.all_in) bid.all_in = al_in.label;
    });
    var bid_seeker = quote &&
      quote.bid &&
      quote.bids.filter(data => (data.author.id === getUser().id));
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12" style={{ color: "#ff4500" }}>
            <h1>DETTAGLI INSERZIONE</h1>
            <hr />
            {(isAgent() && (quote.author && quote.author.id) === getUser().id) || (isAirline() && bid_seeker && bid_seeker.length !== '') &&
              quote.status == "CLOSED" ? (
                <div>
                  <h1 style={{ color: "slategray" }}>*** INSERZIONE CHIUSA ***</h1>
                  <ul className="list-unstyled">
                    <li className="row">
                      <strong className="col-xs-2">
                        <IntlMessages id="forms.author" /> :
                                  </strong>
                      <span className="col-xs-5">
                        {quote.author
                          ? quote.author.firstname +
                          " " +
                          quote.author.lastname
                          : ""}
                      </span>
                    </li>
                    <li className="row">
                      <strong className="col-xs-2">
                        <IntlMessages id="forms.company" /> :
                                  </strong>
                      <span className="col-xs-5">
                        {quote.company
                          ? quote.company.agent_company_name
                          : ""}
                      </span>
                    </li>
                  </ul>
                </div>
              ) : (
                ""
              )}
            {isAgent() ? (
              <>
                <button
                  className="float-right btn-danger btn-shadow btn btn-multiple-state btn-lg"
                  data-html2canvas-ignore="true"
                  // style={{ color: `${this.state.pdfReady ? 'black' : 'white'}`, backgroundColor: `${this.state.pdfReady ? 'yellow' : '#dc3545'}` }}
                  onClick={() => {
                    // featch bid data to use in pdf
                    this.fetchData();

                    var currentdate = new Date();
                    var datetime =
                      "print : " +
                      currentdate.getDate() +
                      "/" +
                      (currentdate.getMonth() + 1) +
                      "/" +
                      currentdate.getFullYear() +
                      " @ " +
                      currentdate.getHours() +
                      ":" +
                      currentdate.getMinutes() +
                      ":" +
                      currentdate.getSeconds();

                    const doc = new jsPDF();
                    doc.autoTable({
                      styles: { fontSize: 13 },
                      head: [
                        [
                          `TITOLO : ${quote.title}`,
                          `Totale Quotazioni : ${quote.total_bids}`,
                        ],
                      ],
                    });

                    doc.autoTable({
                      styles: { fontSize: 9 },
                      body: [
                        [
                          `Tipologia :${quote.types}`,
                          `General Cargo :${quote.gencargo ? "Yes" : "No"}`,
                        ],
                        [
                          `Area Geografica :${quote.area}`,
                          `Stackable :${quote.stackable ? "Yes" : "No"}`,
                        ],
                        [
                          `Origine :${quote.origin}`,
                          `Tiltable :${quote.tiltable ? "Yes" : "No"}`,
                        ],
                        [`Sigla Aeroporto Destinazione :${quote.airport}`],
                        [
                          `Number of pieces :${dimensions.length ? quote.total_pieces : quote.piece
                          }`,
                        ],
                        [
                          `Peso (Kgs) :${quote.kilos
                            ? parseFloat(quote.kilos).toFixed(2)
                            : quote.kilos
                          }`,
                        ],
                        [
                          `Volume :${quote.volume
                            ? parseFloat(quote.volume).toFixed(2)
                            : quote.volume
                          }`,
                        ],
                        [
                          `Chargeable Weight :${dimensions.length
                            ? parseFloat(quote.final_weight).toFixed(2)
                            : parseFloat(quote.weight).toFixed(2)
                              ? quote.weight
                              : 0
                          }`,
                        ],
                        [
                          `Data Approntamento :${getDateWithFormat(
                            new Date(quote.rfc),
                            "DD-MM-YY"
                          )}`,
                        ],
                        [
                          `Chiusura Inserzione: ${getDateWithFormat(
                            new Date(quote.deadline),
                            "DD-MM-YY"
                          )}`,
                        ],
                        [`Notes: ${quote.note ? quote.note : "---"}`],
                      ],
                    });

                    doc.autoTable({
                      styles: { fontSize: 9, align: "center" },
                      head: [
                        [
                          "VETTORE",
                          "TARIFFA",
                          "SURCHARGES",
                          "CHBL.WEIGHT",
                          "STATUS",
                          "USERNAME",
                          "EMAIL",
                        ],
                      ],
                      body: this.state.bidData,
                    });

                    // add today date in bottom
                    doc.setFontType("italic");
                    doc.setFontSize(8);
                    doc.text(datetime, 10, doc.internal.pageSize.height - 3);

                    //save pdf
                    if (this.state.pdfReady) {
                      doc.save(this.state.quote.slug + ".pdf");
                    }
                  }}
                >
                  {" "}
                  {this.state.pdfReady
                    ? `Ready !! Download it now`
                    : `Elaborazione PDF`}{" "}
                </button>
                <button
                  onClick={(e) => {
                    this.setState({ action: "closeQuote" }), this.openModal();
                  }}
                  className=" float-right btn-shadow btn-multiple-state btn  btn-primary mr-2 btn-lg"
                >
                  Chiudi Inserzione&nbsp;
                  <i
                    id="TooltipcloseQuote"
                    className="fa fa-question-circle"
                    aria-hidden="true"
                  ></i>
                  <Tooltip
                    placement="right"
                    isOpen={this.state.tooltipOpen5}
                    target="TooltipcloseQuote"
                    toggle={this.toggle5}
                  >
                    <IntlMessages id="closeQuote_tooltip" />
                  </Tooltip>
                </button>
              </>
            ) : (
                <></>
              )}
          </Colxx>
        </Row>
        <div id="divToPrint">
          {loaded ? (
            <Row>
              <Colxx xl="12" lg="12" className="mb-4">
                <div className="d-flex mb-3">
                  <CardBody>
                    <div className="row mb-4">
                      <div className="col-sm-6">
                        <div className="row">
                          <div className="col-sm-12"
                            style={{
                              textAlign: "left",
                              color: "white",
                              backgroundColor: "#1565c0",
                            }}>
                            <h5 style={{ top: 3, position: 'relative' }}
                              className="card-title mb-2"
                            >
                              <strong> TITOLO : {quote.title}</strong>
                            </h5>
                          </div>
                        </div>
                        <br />
                        <div className="row">
                          <div className="col-sm-12 col-md-7">
                            <ul className="list-unstyled">
                              <li className="row">
                                <strong className="col-xs-7">
                                  <IntlMessages id="forms.types" /> :
                                </strong>{" "}
                                <span className="col-xs-5">{quote.types}</span>
                              </li>
                              <li className="row">
                                <strong className="col-xs-7">
                                  <IntlMessages id="forms.area" /> :
                                </strong>{" "}
                                <span className="col-xs-5">{quote.area}</span>
                              </li>
                              <li className="row">
                                <strong className="col-xs-7">
                                  <IntlMessages id="forms.origin" /> :
                                </strong>{" "}
                                <span className="col-xs-5">{quote.origin}</span>
                              </li>
                              <li className="row">
                                <strong className="col-xs-7">
                                  <IntlMessages id="forms.destination" /> :
                                </strong>{" "}
                                <span className="col-xs-5">
                                  {quote.airport}
                                </span>
                              </li>
                              <li className="row">
                                <strong className="col-xs-7">
                                  <IntlMessages id="forms.total_piece" /> :
                                </strong>{" "}
                                <span className="col-xs-5">
                                  {dimensions.length
                                    ? quote.total_pieces
                                    : quote.piece}
                                </span>
                              </li>
                              <li className="row">
                                <strong className="col-xs-7">
                                  <IntlMessages id="forms.kilo" /> :
                                </strong>{" "}
                                <span className="col-xs-5">
                                  {quote.kilos
                                    ? parseFloat(quote.kilos).toFixed(2)
                                    : quote.kilos}
                                </span>
                              </li>
                              <li className="row">
                                <strong className="col-xs-7">
                                  <IntlMessages id="forms.volume" /> :
                                </strong>{" "}
                                <span className="col-xs-5">
                                  {quote.volume
                                    ? parseFloat(quote.volume).toFixed(2)
                                    : quote.volume}
                                </span>
                              </li>
                              <li className="row">
                                <strong className="col-xs-7">
                                  Chargeable Weight :
                                </strong>{" "}
                                <span className="col-xs-5">
                                  {dimensions.length
                                    ? parseFloat(quote.final_weight).toFixed(2)
                                    : parseFloat(quote.weight).toFixed(2)
                                      ? quote.weight
                                      : 0}
                                </span>
                              </li>
                              <li className="row">
                                <strong className="col-xs-7">
                                  <IntlMessages id="forms.rfc" /> :
                                </strong>{" "}
                                <span className="col-xs-5">
                                  {getDateWithFormat(
                                    new Date(quote.rfc),
                                    "DD-MM-YY"
                                  )}
                                </span>
                              </li>
                              <li className="row">
                                <strong className="col-xs-7">
                                  <IntlMessages id="forms.deadline-date" /> :
                                </strong>{" "}
                                <span className="col-xs-5">
                                  {getDateWithFormat(
                                    new Date(quote.deadline),
                                    "DD-MM-YY"
                                  )}
                                </span>
                              </li>
                            </ul>
                          </div>
                          <div className="col-sm-12 col-md-5">
                            <ul className="list-unstyled">
                              <li className="row">
                                <strong className="col-xs-7">
                                  <IntlMessages id="forms.general-cargo" /> :
                                </strong>{" "}
                                <span
                                  className={
                                    quote.gencargo === false && "text-danger"
                                  }
                                >
                                  {quote.gencargo ? "Yes" : "No"}
                                </span>
                              </li>
                              <li className="row">
                                <strong className="col-xs-7">
                                  <IntlMessages id="forms.stackable" /> :
                                </strong>{" "}
                                <span
                                  className={
                                    quote.stackable === false && "text-danger"
                                  }
                                >
                                  {quote.stackable ? "Yes" : "No"}
                                </span>
                              </li>
                              <li className="row">
                                <strong className="col-xs-7">
                                  <IntlMessages id="forms.tiltable" /> :
                                </strong>{" "}
                                <span
                                  className={
                                    quote.tiltable === false && "text-danger"
                                  }
                                >
                                  {quote.tiltable ? "Yes" : "No"}
                                </span>
                              </li>
                              {!quote.gencargo ? (
                                <>
                                  <li className="row">
                                    <strong className="col-xs-7">
                                      <IntlMessages id="forms.dgr" /> :
                                    </strong>{" "}
                                    <span
                                      className={
                                        quote.dgr === true && "text-danger"
                                      }
                                    >
                                      {quote.dgr ? "Yes" : "No"}
                                    </span>
                                  </li>
                                  <li className="row">
                                    <strong className="col-xs-7">
                                      <IntlMessages id="forms.perishable" /> :
                                    </strong>{" "}
                                    <span
                                      className={
                                        quote.perishable === true &&
                                        "text-danger"
                                      }
                                    >
                                      {quote.perishable ? "Yes" : "No"}
                                    </span>
                                  </li>
                                  <li className="row">
                                    <strong className="col-xs-7">
                                      <IntlMessages id="forms.other-special-cargo" />{" "}
                                      :
                                    </strong>{" "}
                                    <span
                                      className={
                                        quote.special_cargo === true &&
                                        "text-danger"
                                      }
                                    >
                                      {quote.special_cargo ? "Yes" : "No"}
                                    </span>
                                  </li>
                                </>
                              ) : (
                                  ""
                                )}
                            </ul>
                          </div>
                          <div className="col-sm-12">
                            <div className="row">
                              <strong className="col-sm-12">Notes:</strong>
                              <span className="col-sm-12">
                                {quote.note ? quote.note : "---"}
                              </span>
                              <hr />
                            </div>
                          </div>

                          <div className="col-sm-12 mt-3">
                            <div className="row">
                              <strong
                                className="col-sm-12"
                                style={{
                                  textAlign: "left",
                                  color: "white",
                                  backgroundColor: "#1565c0",
                                  fontSize: "18px",
                                }}
                              >
                                Domande dai Vettori:
                              </strong>
                              {this.state.questions.length ? (
                                this.state.questions.map((question, i) => {
                                  return (
                                    <div
                                      key={i}
                                      style={{
                                        borderBottom: "1px solid",
                                        paddingBottom: "7px",
                                      }}
                                      className="col-sm-12 mt-2"
                                    >
                                      <div
                                        style={{ fontSize: "10px" }}
                                        className="col-sm-12"
                                        style={{ color: "#ff4500" }}
                                      >
                                        {" "}
                                        Domanda : {question.content}
                                      </div>
                                      <div
                                        style={{ fontSize: "10px" }}
                                        className="col-sm-11"
                                        style={{ color: "#66669d" }}
                                      >
                                        {" "}
                                        Risposta : {question.replay}
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                  <div
                                    className="col-sm-12 mt-2"
                                    style={{ fontSize: "13px" }}
                                    className="col-sm-12"
                                    style={{ color: "#ff4500" }}
                                  >
                                    {" "}
                                  Non ci sono domande al momento.{" "}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6">
                        <Row>
                          <Colxx
                            md={6}
                            xs={12}
                            style={{ color: "#FF4500", fontSize: "18px" }}
                          >
                            <strong>
                              Totale Visualizzazioni : {quote.views_count}{" "}
                            </strong>
                          </Colxx>
                          <Colxx
                            md={6}
                            xs={12}
                            style={{ color: "#FF4500", fontSize: "18px" }}
                          >
                            <strong>
                              Totale Quotazioni : {quote.total_bids}{" "}
                            </strong>
                          </Colxx>
                        </Row>
                        <br />
                        {dimensions.length ? (
                          <Row>
                            <Colxx
                              sm={12}
                              style={{
                                backgroundColor: "#1565c0",
                                textAlign: "center",
                                color: "white",
                                fontSize: "16px",
                              }}
                            >
                              <strong>
                                <IntlMessages id="forms.dimensions" />
                              </strong>

                              <table
                                id="cubic_table"
                                className="calculation-table table"
                              >
                                <thead>
                                  <tr
                                    style={{
                                      backgroundColor: "#1565c0",
                                      textAlign: "center",
                                      color: "white",
                                    }}
                                  >
                                    <th scope="col">Pieces</th>
                                    <th scope="col">Length</th>
                                    <th scope="col">Wdith</th>
                                    <th scope="col">Height</th>
                                    <th scope="col">CBM</th>
                                  </tr>
                                </thead>
                                <tbody
                                  style={{
                                    backgroundColor: "#d6cdca",
                                    textAlign: "center",
                                  }}
                                >
                                  {dimensions.map((dimension, i) => {
                                    return (
                                      <tr key={i} className="table_0">
                                        <td>{dimension.colli} </td>
                                        <td> {dimension.length} </td>
                                        <td> {dimension.width} </td>
                                        <td> {dimension.height} </td>
                                        <td
                                          className="table_0"
                                          style={{ width: "20%" }}
                                        >
                                          {(dimension.cbm / 1000000).toFixed(2)}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </Colxx>
                            <Colxx sm={12}>
                              <br />
                              <Row>
                                <Colxx
                                  md={3}
                                  xs={12}
                                  style={{
                                    backgroundColor: "#1565c0",
                                    borderColor: "#9400D3",
                                    color: "white",
                                  }}
                                >
                                  <strong>
                                    Totale colli : {quote.total_pieces}{" "}
                                  </strong>
                                </Colxx>
                                <Colxx
                                  md={4}
                                  xs={12}
                                  style={{
                                    backgroundColor: "#1565c0",
                                    borderColor: "#9400D3",
                                    color: "white",
                                  }}
                                >
                                  <strong>
                                    Volume Totale : {quote.net_volume}{" "}
                                  </strong>
                                </Colxx>
                                <Colxx
                                  md={5}
                                  xs={12}
                                  style={{
                                    backgroundColor: "#1565c0",
                                    borderColor: "#9400D3",
                                    color: "white",
                                  }}
                                >
                                  <strong>
                                    Chargeable Weight : {quote.final_weight}{" "}
                                  </strong>
                                </Colxx>
                              </Row>
                            </Colxx>
                          </Row>
                        ) : (
                            ""
                          )}
                      </div>
                    </div>
                  </CardBody>
                  {action === "closeQuote" && (
                    <Modal
                      isOpen={this.state.modalIsOpen}
                      onRequestClose={this.closeModal}
                    >
                      <ModalHeader>CHIUDI LA TUA INSERZIONE.</ModalHeader>
                      <ModalBody>
                        Sei sicuro voler chiudere definitivamente l'inserzione?
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="btn-shadow btn-multiple-state btn btn-secondary btn-lg"
                          onClick={(e) => this.closeQuote()}
                        >
                          Si
                        </Button>{" "}
                        <Button
                          color="btn-shadow btn-multiple-state btn btn-primary btn-lg"
                          onClick={this.closeModal}
                        >
                          No
                        </Button>
                      </ModalFooter>
                    </Modal>
                  )}
                </div>
                {isAirline() ? (
                  quote.bids.length > 0 && quote.bid !== false ? (
                    <div className="d-flex mb-3">
                      <CardBody>
                        <Row>
                          <Label for="emailHorizontal" sm={12}>
                            <h2
                              style={{
                                textAlign: "center",
                                color: "white",
                                backgroundColor: "#ff4500",
                                marginLeft: "-15px",
                                paddingLeft: "16px",
                                paddingRight: "16px",
                              }}
                            >
                              LA TUA MIGLIORE QUOTAZIONE:
                            </h2>
                          </Label>
                        </Row>
                        {quote &&
                          quote.bid &&
                          quote.bids.map((bid, i) => (
                            <Form key={i} data={bid.status}>
                              <hr style={{ marginTop: 0 }} />
                              <Row>
                                <Label
                                  for="emailHorizontal"
                                  sm={6}
                                  style={{ color: "#ff4500" }}
                                >
                                  <h5>
                                    Questa quotazione risulta in posizione{" "}
                                    {bid.rank <= 3
                                      ? "1-3"
                                      : bid.rank <= 7
                                        ? "4-7"
                                        : "8-10"}{" "}
                                    su un totale di {quote.total_bids}{" "}
                                    quotazioni ricevute.
                                  </h5>
                                  <br />
                                </Label>
                                <div
                                  className="col-sm-6 text-right"
                                  data-html2canvas-ignore="true"
                                >
                                  {quote && quote.bid ? (
                                    <Link
                                      to={
                                        "/" +
                                        URL_PREFIX +
                                        "/airline/quotes/" +
                                        quote.slug +
                                        "/bids/" +
                                        bid.id +
                                        "/update"
                                      }
                                      className="btn btn-lg btn-shadow btn-info"
                                    >
                                      MIGLIORA
                                    </Link>
                                  ) : (
                                      ""
                                    )}{" "}
                                  &nbsp;
                                  {quote && quote.bid && quote.user_all_bids < 2 ? (
                                    <a
                                      onClick={() => {
                                        this.setState({
                                          action: "deleteBid",
                                          bidToBeDeleted: bid.id,
                                        });
                                        this.openModal();
                                      }}
                                      className="btn btn-lg btn-shadow btn-danger text-white"
                                    >
                                      CANCELLA &nbsp;
                                      <i
                                        id="CancelBid"
                                        className="fa fa-question-circle"
                                        aria-hidden="true"
                                      ></i>
                                      <Tooltip
                                        placement="right"
                                        isOpen={this.state.tooltipOpen4}
                                        target="CancelBid"
                                        toggle={this.toggle4}
                                      >
                                        Puoi cancellare la tua quotazione.La
                                        stessa resterà comunque visibile
                                        all'inserzionista, evidenziata come
                                        VOIDED. Dopo avere cancellato una
                                        quotazione, ti resta una sola altra
                                        possibilità per quotare sulla stessa
                                        inserzione.
                                      </Tooltip>
                                    </a>
                                  ) : (
                                      ""
                                    )}
                                </div>
                              </Row>

                              <Row>
                                <Colxx sm={12}>
                                  <FormGroup>
                                    <Label
                                      for="emailHorizontal"
                                      className="text-uppercase"
                                    >
                                      {quote.title}
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
                                    <Label
                                      for="emailHorizontal"
                                      className="text-uppercase"
                                    >
                                      {bid_carriers[bid.id] &&
                                        bid_carriers[bid.id].length
                                        ? bid_carriers[bid.id][3] +
                                        " - " +
                                        bid_carriers[bid.id][2]
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
                                      <strong>DETTAGLIO TARIFFA: </strong>
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
                                    <Label
                                      for="emailHorizontal"
                                      className="text-uppercase"
                                    >
                                      &nbsp;&nbsp;
                                      {CONDITIONS_CHOICES.map((condition) => {
                                      if (condition.value === bid.conditions)
                                        return condition.label;
                                    })}
                                    </Label>
                                  </FormGroup>
                                </Colxx>
                              </Row>
                              <Row>
                                <Colxx sm={6} md={3}>
                                  <FormGroup>
                                    <Label for="emailHorizontal">
                                      <strong>Data Pubblicazione: </strong>
                                    </Label>
                                    <Label for="emailHorizontal">
                                      &nbsp;&nbsp;
                                      {getDateWithFormat(new Date(bid.publish))}
                                    </Label>
                                  </FormGroup>
                                </Colxx>
                                <Colxx sm={6} md={9}>
                                  <FormGroup>
                                    <Label for="emailHorizontal">
                                      <strong>Status: </strong>
                                    </Label>
                                    <Label for="emailHorizontal">
                                      &nbsp;&nbsp;{bid.status}
                                    </Label>
                                  </FormGroup>
                                </Colxx>
                                <Colxx sm={12}>
                                  <FormGroup>
                                    <Label
                                      for="emailHorizontal"
                                      className="text-uppercase"
                                    >
                                      <strong>
                                        <IntlMessages id="forms.remarks" />
                                      </strong>
                                    </Label>
                                    <Label
                                      for="emailHorizontal"
                                      className="text-uppercase"
                                    >
                                      &nbsp;&nbsp;{bid.remarks}
                                    </Label>
                                  </FormGroup>
                                </Colxx>
                              </Row>
                            </Form>
                          ))}
                      </CardBody>
                    </div>
                  ) : (
                      ""
                    )
                ) : (
                    ""
                  )}

                <div></div>

                {isAirline() ? (
                  quote.bids.length > 0 && quote.bid !== false ? (
                    <div className="d-flex mb-3">
                      <CardBody>
                        <div className="row mb-4">
                          <div
                            className="col-sm-12"
                            style={{
                              textAlign: "center",
                              color: "white",
                              paddingTop: "5px",
                              backgroundColor: "#1565c0",
                            }}
                          >
                            <h5 className="card-title mb-2">
                              Dettaglio Quotazioni Ricevute Finora: &nbsp;
                              <i
                                id="Tooltipdeadline"
                                className="fa fa-question-circle"
                                aria-hidden="true"
                              ></i>
                              <Tooltip
                                placement="right"
                                isOpen={this.state.tooltipOpen}
                                target="Tooltipdeadline"
                                toggle={this.toggle}
                              >
                                I dati sono a puro titolo indicativo viste le
                                diverse modalita' tariffarie applicate dai vari
                                vettori.
                              </Tooltip>
                            </h5>
                          </div>

                          <hr style={{ marginTop: 12 }} />
                          <div
                            className="col-sm-12"
                            style={{ color: "#66669d", fontSize: "12px" }}
                          >
                            <br />
                            <span>
                              {" "}
                              <h3 style={{ color: "#ff4500" }}>
                                TOTALE QUOTAZIONI RICEVUTE: {quote.total_bids}
                              </h3>
                            </span>
                            <br />
                            <ul style={{ color: "#ff4500" }}>
                              {bid_summary.bid_all_in > 0 ? (
                                <li>
                                  Quotazioni ALL IN: {bid_summary.bid_all_in} .
                                </li>
                              ) : (
                                  ""
                                )}
                              {bid_summary.bid_without_surcharges > 0 ? (
                                <li>
                                  Quotazioni con Tariffa Netta + Addizionali:
                                  {bid_summary.bid_without_surcharges}{" "}
                                  {bid_summary.bid_without_surcharges > 1
                                    ? " quotazioni"
                                    : " quotazione"}
                                </li>
                              ) : (
                                  ""
                                )}
                              {Object.keys(bid_summary.bid_have_origin).map(
                                (origin, i) => (
                                  <li key={i}>
                                    {bid_summary.bid_have_origin[origin]}{" "}
                                    {bid_summary.bid_have_origin[origin] > 1
                                      ? " quotazioni"
                                      : " quotazione"}{" "}
                                    : Tariffa Origina da {origin}..
                                  </li>
                                )
                              )}
                              {Object.keys(bid_summary.bid_have_condition).map(
                                (condition, i) => (
                                  <li key={i}>
                                    {bid_summary.bid_have_condition[condition]}{" "}
                                    quotazione/i valide per
                                    {CONDITIONS_CHOICES.map((cond) =>
                                      cond.value === condition
                                        ? " " + cond.label
                                        : ""
                                    )}
                                  </li>
                                )
                              )}
                              {bid_summary.bid_require_CW > 0 ? (
                                <li>
                                  Quotazioni richiedenti CW superiore rapporto
                                  1:6: {bid_summary.bid_require_CW}{" "}
                                  {bid_summary.bid_require_CW > 1
                                    ? " quotazioni"
                                    : "quotazione"}{" "}
                                  .
                                </li>
                              ) : (
                                  ""
                                )}
                            </ul>
                          </div>
                        </div>
                      </CardBody>
                    </div>
                  ) : (
                      ""
                    )
                ) : (
                    ""
                  )}
              </Colxx>

              <Colxx xl="12" lg="12" className="mb-4">
                {isAgent() ? (
                  <BidList moreProps={this.props} quote={this.state.quote} />
                ) : (
                    ""
                  )}
              </Colxx>
            </Row>
          ) : (
              ""
            )}
        </div>
        <div className="container">
          {quote.slug && isAirline() ? (
            <div className="row" data-html2canvas-ignore="true">
              <div className="col-sm-12 col-md-4">
                <Link
                  to={"/" + URL_PREFIX + "/airline/quotes"}
                  className="btn btn-danger btn-shadow btn-multiple-state btn-lg"
                >
                  INDIETRO
                </Link>
              </div>
              <div className="col-sm-12 col-md-4 text-md-center"></div>
              <div className="col-sm-12 col-md-4 text-md-right quote-dropdown-btns">
                <ButtonGroup className="mb-2">
                  <ButtonDropdown
                    isOpen={this.state.nestingDropdownOpen}
                    toggle={this.nestingToggle}
                  >
                    <DropdownToggle
                      className="btn-shadow btn-multiple-state btn-lg"
                      caret
                      style={{
                        backgroundColor: "#17a2b8",
                        borderColor: "#17a2b8",
                      }}
                    >
                      OPZIONI
                    </DropdownToggle>
                    <DropdownMenu>
                      {quote.user_bids < 1 && quote.status !== "CLOSED" ? (
                        <DropdownItem>
                          <Link
                            to={
                              "/" +
                              URL_PREFIX +
                              "/airline/quotes/" +
                              quote.slug +
                              "/bids/make"
                            }
                          >
                            Invia Quotazione
                          </Link>
                        </DropdownItem>
                      ) : (
                          ""
                        )}
                      <DropdownItem>
                        <span onClick={this.openModal}> Fai una domanda </span>

                        <i
                          id="Tooltipdeadline2"
                          className="fa fa-question-circle"
                          aria-hidden="true"
                        ></i>
                        <Tooltip
                          placement="right"
                          isOpen={this.state.tooltipOpen2}
                          target="Tooltipdeadline2"
                          toggle={this.toggle2}
                        >
                          Puoi fare una domanda all'agente inserzionista per
                          richiedere ulteriori chiarimenti. La domanda e la
                          risposta saranno poi pubblicate e visibili a tutti.
                        </Tooltip>
                      </DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>
                </ButtonGroup>
              </div>
              <Modal
                isOpen={this.state.modalIsOpen}
                onRequestClose={this.closeModal}
              >
                {action === "deleteBid" ? (
                  <>
                    <ModalHeader>Cancella quotazione</ModalHeader>
                    <ModalBody>
                      Sei sicuro voler cancellare la tua quotazione?
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="btn-shadow btn-multiple-state btn btn-primary btn-lg"
                        onClick={(e) => this.deleteBid(bidToBeDeleted)}
                      >
                        SI
                      </Button>{" "}
                      <Button
                        color="btn-shadow btn-multiple-state btn btn-secondary btn-lg"
                        onClick={this.closeModal}
                      >
                        NO
                      </Button>
                    </ModalFooter>
                  </>
                ) : (
                    <>
                      <ModalHeader>Invia una domanda:</ModalHeader>
                      <ModalBody>
                        <Input
                          style={inputStyle}
                          key="question_i"
                          id="question_i"
                          value={this.state.question}
                          onChange={(e) => this.onInputChange(e)}
                        />
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="btn-shadow btn-multiple-state btn btn-primary btn-lg"
                          onClick={this.sendMessage}
                          disabled={this.state.sendMessagePending}
                        >
                          Invia &nbsp;
                        <i
                            id="Tooltipdeadline3"
                            className="fa fa-question-circle"
                            aria-hidden="true"
                          ></i>
                          <Tooltip
                            placement="right"
                            isOpen={this.state.tooltipOpen3}
                            target="Tooltipdeadline3"
                            toggle={this.toggle3}
                          >
                            La domanda verrá inviata via email all'agente
                            inserzionista.
                        </Tooltip>
                        </Button>{" "}
                        <Button
                          color="btn-shadow btn-multiple-state btn btn-secondary btn-lg"
                          onClick={this.closeModal}
                          disabled={this.state.sendMessagePending}
                        >
                          Cancella
                      </Button>
                      </ModalFooter>
                    </>
                  )}
              </Modal>
            </div>
          ) : (
              ""
            )}
        </div>
      </Fragment>
    );
  }
}
export default injectIntl(ViewQuote);
