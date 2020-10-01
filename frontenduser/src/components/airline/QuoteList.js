import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Nav,
  NavItem,
  NavLink,
  Badge,
  Row,
} from "reactstrap";
import ReactTable from "react-table";

import IntlMessages from "../../helpers/IntlMessages";
import Pagination from "../DatatablePagination";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { getDateWithFormat, sendError, getWeight } from "../../helpers/Utils";
import { isAgent, TYPES_CHOICES } from "../../helpers/API";
import { successNoti, errorNoti } from "../../helpers/Notifications";
import {
  STATUS_CHOICES,
  TYPES,
  ORIGIN_CHOICES,
  AREA_CHOICES,
  DROPDOWN_WAIT,
  loadOptions,
} from "../../helpers/API";
import { Colxx } from "../common/CustomBootstrap";
import ActionList from "../agent/ActionList";
import { Col } from "react-bootstrap";
import { URL_PREFIX } from "../../constants/defaultValues";
import { PusherContext } from "../../context";
// import data from "../../data/quoting";

const CustomTableFilter = ({ filter, onChange }) => {
  return (
    <input
      className="border-dark form-control"
      placeholder="search"
      value={filter ? filter.value : ""}
      onChange={(event) => (event ? onChange(event.currentTarget.value) : "")}
    />
  );
};

const CustomTableFilter_2 = ({ filter, onChange }) => {
  let style = { height: 44 };
  if (filter && filter.value === "close") style["color"] = "#c43d4b";
  else if (filter && filter.value === "open") style["color"] = "#3e884f";

  return (
    <select
      className="border-dark form-control"
      placeholder="search"
      style={style}
      onChange={(event) => (event ? onChange(event.currentTarget.value) : "")}
      value={filter ? filter.value : ""}
    >
      <option style={{ color: "#104ab6" }} value="">
        Any
      </option>
      <option style={{ color: "#3e884f" }} value="open">
        Open
      </option>
      <option style={{ color: "#c43d4b" }} value="close">
        Close
      </option>
      on>
    </select>
  );
};

const CustomTableFilter_area = ({ filter, onChange }) => {
  return (
    <select
      className="border-dark form-control"
      placeholder="search"
      style={{ height: 44 }}
      onChange={(event) => (event ? onChange(event.currentTarget.value) : "")}
      value={filter ? filter.value : ""}
    >
      <option value="">Tutte</option>
      <option value="AF">Africa</option>
      <option value="CA">Central America</option>
      <option value="EU">Europe</option>
      <option value="FE">Far East</option>
      <option value="IN">Indian S.C.</option>
      <option value="ME">Middle East</option>
      <option value="AU">Oceania</option>
      <option value="NA">North America</option>
      <option value="SA">South America</option>
      <option value="RU">Russia & Caspian</option>
    </select>
  );
};

const CustomTableFilter_org = ({ filter, onChange }) => {
  return (
    <select
      className="border-dark form-control"
      placeholder="search"
      style={{ height: 44 }}
      onChange={(event) => (event ? onChange(event.currentTarget.value) : "")}
      value={filter ? filter.value : ""}
    >
      <option value="">Tutte</option>
      <option value="AOI">AOI</option>
      <option value="BLQ">BLQ</option>
      <option value="BRI">BRI</option>
      <option value="CTA">CTA</option>
      <option value="FCO">FCO</option>
      <option value="FLR">FLR</option>
      <option value="GOA">GOA</option>
      <option value="MIL">MIL</option>
      <option value="MXP">MXP</option>
      <option value="MXP">NAP</option>
      <option value="PSA">PSA</option>
      <option value="CTA">PMO</option>
      <option value="TRN">TRN</option>
      <option value="PSA">VCE</option>
      on>
    </select>
  );
};

const CustomTableFilter_wt = ({ filter, onChange }) => {
  return (
    <select
      className="border-dark form-control"
      placeholder="search"
      style={{ height: 44 }}
      onChange={(event) => (event ? onChange(event.currentTarget.value) : "")}
      value={filter ? filter.value : "all"}
    >
      <option value="all"> Qualsiasi </option>
      <option value="<1000"> &lt; 1000k </option>
      <option value="<3000"> &lt; 3000k </option>
      <option value=">3000"> &gt; 3000k </option>
      on>
    </select>
  );
};

const CustomTypeFilter = ({ filter, onChange }) => {
  return (
    <select
      className="border-dark form-control"
      placeholder="search"
      style={{ height: "44px" }}
      onChange={(event) => (event ? onChange(event.currentTarget.value) : "")}
      value={filter ? filter.value : ""}
    >
      <option value="">Any</option>
      {TYPES_CHOICES.map((type) => (
        <option value={type.value}>{type.label}</option>
      ))}
    </select>
  );
};

class QuotingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pages: null,
      loading: true,
      sorted: [],
      defaultPageSize: 30,
      modal: false,
      bid: {},
      quoteScope: "all",
      filter_field: "publish",
      filter_type: "-",
      tableState: {},
      agentChannels: [],
    };

    this.fetchData = this.fetchData.bind(this);
  }
  static contextType = PusherContext;

  fetchData(state, instance) {
    // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
    // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
    this.setState({ loading: true, tableState: state });
    let params = {
      format: "datatables",
      scope: state.scope ? state.scope : this.state.quoteScope,
      length: state.pageSize,
      start: state.page * state.pageSize,
    };

    state.filtered.map((filter) => {
      params[filter.id] = filter.value;
    });

    params["ordering"] = "";
    params["ordering"] += this.state.filter_type + this.state.filter_field;
    // Request the data however you want.  Here, we'll use our mocked service we created earlier
    api.list(
      "quotes",
      params,

      (err, res) => {
        // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
        this.setState({
          data: res.data,
          pages: Math.ceil(res.recordsFiltered / state.pageSize),
          loading: false,
        });
        // open a channel to listen to  every bid update for this quote
        if (
          this.state.quoteScope === "my" &&
          res.data.length &&
          res.data[0].bid
        ) {
          const pusher = this.context;
          this.setState({ agentChannels: [] });
          const newAgentChannels = [];
          for (let i = 0; i < this.state.data.length; i++) {
            // unsubscribe from airlines channel
            pusher.unsubscribe("airlines");
            const channelName = "agent" + this.state.data[i].bid.quote;
            newAgentChannels.push(channelName);
            let channel = pusher.channel(channelName);
            if (!channel) {
              channel = pusher.subscribe(channelName);
            }
            channel.unbind_all();
            channel.bind(
              "bid" + this.state.data[i].bid.quote,
              function (data) {
                this.refs.table.fireFetchData();
              }.bind(this)
            );
          }
          this.setState({ agentChannels: newAgentChannels });
          // open a chennel to listen to the quote creation
        } else if (this.state.quoteScope === "all") {
          const pusher = this.context;
          // unsubscrib from agent channels
          this.state.agentChannels.map((channelsName) => {
            pusher.unsubscribe(channelsName);
          });
          const channelName = "airlines";
          let channel = pusher.channel(channelName);
          if (!channel) {
            channel = pusher.subscribe(channelName);
          }
          channel.unbind_all();
          channel.bind(
            "quote_created",
            function (data) {
              let new_quote = JSON.parse(data.message);
              // verify if this quote already exists
              let condition = this.state.data.findIndex(
                (quote) => quote.id === new_quote.id
              );
              // if it doesn't exists
              if (condition === -1) {
                let new_data = [new_quote, ...this.state.data];
                setTimeout(() => {
                  delete new_data[0]["new"];
                  this.setState({ data: new_data });
                }, 10000);
                new_data[0]["new"] = true;
                this.setState({ data: new_data });
              } else {
                console.log("this quote already exists : ", new_quote);
              }
            }.bind(this)
          );
          channel.bind(
            "quote_closed",
            function (data) {
              // this.refs.table.fireFetchData()
              let new_quote = JSON.parse(data.message);
              let new_data = [...this.state.data];
              new_data = new_data.map((quote) =>
                quote.id !== new_quote.id ? quote : new_quote
              );
              this.setState({ data: new_data });
            }.bind(this)
          );
          channel.bind(
            "quote_closed_from_cron_job",
            function (data) {
              // this.refs.table.fireFetchData()
              let new_quote = JSON.parse(data.message);
              let new_data = [...this.state.data];
              new_data = new_data.map((quote) => {
                if (quote.id !== new_quote.id) {
                  return quote;
                } else {
                  quote.status = "CLOSED";
                  return quote;
                }
              });
              this.setState({ data: new_data });
            }.bind(this)
          );
        }
      }
    );
  }
  toggle = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  getTrProps = (state, rowInfo, instance) => {
    let returnVal = {
      onClick: () => {
        this.props.moreProps.history.push(
          "/" + URL_PREFIX + "/agent/quotes/" + rowInfo.original.slug + "/view"
        );
      },
    };
    let bg_color = "",
      color = "";
    if (this.state.quoteScope !== "all" && rowInfo) {
      (bg_color = "gray"), (color = "black");
      if (rowInfo.original.ranked >= 1 && rowInfo.original.ranked <= 3) {
        color = "white";
        bg_color = "#08b62e";
      } else if (rowInfo.original.ranked >= 4 && rowInfo.original.ranked <= 6) {
        color = "white";
        bg_color = "#f3a702";
      } else if (
        rowInfo.original.ranked >= 7 &&
        rowInfo.original.ranked <= 10
      ) {
        color = "white";
        bg_color = "#c43d4b";
      }

      if (rowInfo.original.status === "CLOSED") {
        color = "white";
        bg_color = "#929292";
      }

      returnVal["style"] = {
        background: bg_color,
        color: color,
      };
    } else if (rowInfo && rowInfo.original.new) {
      returnVal["style"] = {
        background: "#08b62e",
        color: "white",
      };
    } else {
      if (rowInfo !== undefined && !rowInfo.original.is_viewed) {
        bg_color = "#eee";

        returnVal["style"] = {
          background: bg_color,
          color: color,
          fontWeight: "bold",
        };
      }
    }
    return returnVal;
  };

  setQuoteScope = (scope) => {
    this.setState({ quoteScope: scope });
    let tableState = {};
    Object.keys(this.state.tableState).map(
      (key) => (tableState[key] = this.state.tableState[key])
    );
    tableState.scope = scope;
    tableState.filtered = [];
    tableState.sorted = [];
    tableState.length = this.state.defaultPageSize;
    tableState.page = 0;
    this.fetchData(tableState);
  };

  changeOrderField = (e) => {
    this.setState({ filter_field: e.target.value }, () => {
      this.fetchData(this.state.tableState);
    });
  };

  changeOrderType = (e) => {
    this.setState({ filter_type: e.target.value }, () => {
      this.fetchData(this.state.tableState);
    });
  };
  deleteBid = () => {
    api.patch(
      "bids/" + this.state.bid.id + "/",
      { status: "DELETED" },
      (err, response) => {
        successNoti("Your bid has been deleted successfully");
        this.setState({ modal: false });
        this.setQuoteScope("my");
      }
    );
  };
  render() {
    const styles = {
      textAlign: "center",
      color: "white",
      backgroundColor: "#4d79ff",
      fontSize: 12,
    };
    let columns = [
      {
        Header: () => <div style={styles}>Area Geografica</div>,
        accessor: "area",
        Cell: (props) => (
          <p className="list-item-heading" style={{ textAlign: "left" }}>
            <b>
              {AREA_CHOICES.map((area) => {
                if (props.value === area.value) return area.label;
              })}
            </b>
          </p>
        ),
        Filter: CustomTableFilter_area,
        sortable: false,
      },
      {
        Header: () => <div style={styles}>Title</div>,
        accessor: "title",
        Cell: (props) => (
          <p className="list-item-heading" style={{ textAlign: "left" }}>
            <b>{props.value}</b>
          </p>
        ),
        Filter: CustomTableFilter,
        sortable: false,
      },

      {
        Header: () => <div style={styles}>Origine</div>,
        accessor: "origin",
        Cell: (props) => <p className="list-item-heading">{props.value}</p>,

        Filter: CustomTableFilter_org,
        sortable: false,
      },
      {
        Header: () => <div style={styles}>Destinazione</div>,
        accessor: "destination",
        Cell: (props) => (
          <p className="list-item-heading">
            <b>{props.value}</b>
          </p>
        ),
        Filter: CustomTableFilter,
        sortable: false,
      },
      {
        Header: () => <div style={styles}>Status</div>,
        accessor: "status",
        Cell: (props) => {
          let color = "";
          if (this.state.quoteScope !== "all") {
            color = "#c43d4b";

            if (props.original.ranked >= 1 && props.original.ranked <= 3)
              color = "white";
            else if (props.original.ranked >= 4 && props.original.ranked <= 6)
              color = "white";
            else if (props.original.ranked >= 7 && props.original.ranked <= 10)
              color = "white";

            if (props.value === "CLOSED") color = "#d0d34f";
          } else {
            if (props.value === "CLOSED") color = "#FF0000";
            else color = "#26c34b";
          }
          return <strong style={{ color: color }}>{props.value}</strong>;
        },
        Filter: CustomTableFilter_2,

        getProps: (state, rowInfo, column) => {
          return {
            style: {
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 12,
            },
          };
        },
      },
      {
        Header: () => <div style={styles}>Data Pubblicazione</div>,
        accessor: "publish",
        Cell: (props) => (
          <p className="list-item-heading">
            {props.value
              ? getDateWithFormat(new Date(props.value), "DD-MM-YY")
              : null}
          </p>
        ),
        filterMethod: (filter, row) => {},
        Filter: CustomTableFilter,
        filterable: false,
        sortable: false,
      },
      {
        Header: () => <div style={styles}>Termine Inserzione</div>,
        accessor: "deadline",

        Cell: (props) => (
          <p className="list-item-heading">
            {props.value
              ? getDateWithFormat(new Date(props.value), "DD-MM-YY")
              : null}
          </p>
        ),
        Filter: CustomTableFilter,
        filterable: false,
        sortable: false,
      },

      {
        Header: () => <div style={styles}>Chargeable Weight</div>,
        accessor: "weight",
        filterable: false,
        Cell: (props) => (
          <p className="list-item-heading" style={{ textAlign: "right" }}>
            <b>{getWeight(props.value, props.original.dimensions)}</b>
          </p>
        ),
        Filter: CustomTableFilter_wt,
        sortable: false,
      },
      /* {
        Header: () => <div style={styles}>Volume (Cbm)</div>,
        accessor: "volume",
        filterable: false,
        Cell: (props) => (
          <p className="list-item-heading" style={{ textAlign: "right" }}>
            {props.value}
          </p>
        ),
        Filter: CustomTableFilter_wt,
        sortable: false,
      },
      {
        Header: () => <div style={styles}>N. Quotazioni</div>,
        accessor: "total_bids",
        filterable: false,
        Cell: (props) => (
          <p className={props.value === 0 ? "text-danger" : "text-primary"}>
            {props.value}
          </p>
        ),
        sortable: false,
        getProps: (state, rowInfo, column) => {
          return {
            style: {
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 12,
            },
          };
        },
      },
      {
             Header : this.state.quoteScope === 'all' ? "VIEW":"ACTION",
             accessor: "id",
             filterable:false,
             Cell: props => {return this.state.quoteScope !== 'all' ? <ActionList setBid={(bid)=>this.setState({bid:bid, modal:true})} quoteScope={this.state.quoteScope} quote={props.original} />:<Link className="btn btn-primary btn-sm" to={"/"+URL_PREFIX+"/agent/quotes/"+props.value+"/view"}>View</Link>},
             Filter: CustomTableFilter,
             sortable : false
         }*/
    ];

    if (this.state.quoteScope == "my") {
      columns.push({
        Header: () => <div style={styles}>Rate</div>,
        accessor: "bid.rate",
        filterable: false,
        Cell: (props) => (
          <p className="list-item-heading" style={{ textAlign: "right" }}>
            {!isNaN(props.value) ? props.value.toFixed(2) : props.value}
          </p>
        ),
        Filter: CustomTableFilter_wt,
        sortable: false,
      });
    } else {
      columns = columns.filter((col) => col.accessor !== "bid.rate");
    }
    const { data, pages, loading, defaultPageSize, page, modal } = this.state;
    return (
      <Card className="h-100">
        <CardBody style={{ paddingTop: 0 }}>
          <div className="row">
            <div className="col-md-4" style={{ paddingTop: "1.75rem" }}>
              <Nav pills className="nav-fill" style={{ cursor: "pointer" }}>
                <NavItem>
                  <NavLink
                    active={this.state.quoteScope === "all" ? "active" : ""}
                    onClick={() => this.setQuoteScope("all")}
                  >
                    Tutte le Inserzioni
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    active={this.state.quoteScope !== "all" ? "active" : ""}
                    onClick={() => this.setQuoteScope("my")}
                  >
                    Le Mie Quotazioni
                  </NavLink>
                </NavItem>
              </Nav>
            </div>

            <div className="col-md-6" style={{ paddingTop: "1.75rem" }}>
              <Row>
                <Col sm={4} className="text-right">
                  <span style={{ top: "12px", position: "relative" }}>
                    Ordina:
                  </span>
                </Col>
                <Col sm={4}>
                  <select
                    className="border-dark form-control"
                    placeholder="search"
                    onChange={(e) => this.changeOrderField(e)}
                    style={{ height: 44 }}
                  >
                    <option value="publish">Data Pubblicazione</option>
                    <option value="deadline">Termine Inserzione</option>
                    <option value="kilos">Peso Lordo</option>
                  </select>
                </Col>
                <Col sm={4}>
                  <select
                    className="border-dark form-control"
                    placeholder="search"
                    onChange={(e) => this.changeOrderType(e)}
                    style={{ height: 44 }}
                  >
                    <option value="-">Decrescente</option>
                    <option value="">Crescente</option>
                    on>
                  </select>
                </Col>
              </Row>
            </div>
            {this.state.quoteScope !== "all" ? (
              <>
                <div className="col-md-2 text-right" style={{ top: "10px" }}>
                  <Badge color="success" pill className="mb-1">
                    POSIZIONE 1-3 &nbsp;
                  </Badge>
                  <br />
                  <Badge color="info" pill className="mb-1">
                    POSIZIONE 4-6 &nbsp;
                  </Badge>
                  <br />
                  <Badge color="danger" pill className="mb-1">
                    POSIZIONE 7-10
                  </Badge>
                </div>
                <div
                  className="col-sm-12"
                  style={{ color: "#66669d", textAlign: "center" }}
                >
                  <br />
                  In questa pagina sono mostrate tutte le tue quotazioni. (I
                  diversi colori ne evidenziano l'attuale posizionamento tra
                  tutte le tariffe offerte per ciascuna inserzione).
                </div>
              </>
            ) : (
              ""
            )}
          </div>

          <hr />
          <ReactTable
            ref="table"
            className="airline-quote-table"
            columns={columns}
            manual // Forces table not to paginate or sort automatically, so we can handle it server-side
            data={data}
            filterable
            defaultFilterMethod={(filter, row) =>
              String(row[filter.id]) === filter.value
            }
            pages={pages} // Display the total number of pages
            loading={loading} // Display the loading overlay when we need it
            onFetchData={this.fetchData} // Request new data when things change
            sorted={this.state.sorted}
            defaultPageSize={defaultPageSize}
            onSortedChange={(newSort, column) => {
              this.setState({ sorted: newSort });
            }}
            getTrProps={this.getTrProps}
            PaginationComponent={Pagination}
          />
          <Modal isOpen={modal} toggle={() => this.toggle()}>
            <ModalHeader toggle={() => this.toggle()}>
              Annulla Quotazione
            </ModalHeader>
            <ModalBody>Sei sicuro voler annullare la tua quotazione?</ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                className="btn-shadow btn-multiple-state btn btn-primary btn-lg"
                onClick={() => this.deleteBid()}
              >
                Si
              </Button>{" "}
              <Button
                color="secondary"
                className="btn-shadow btn-multiple-state btn btn-secondary btn-lg"
                onClick={() => this.toggle()}
              >
                No
              </Button>
            </ModalFooter>
          </Modal>
        </CardBody>
      </Card>
    );
  }
}
export default QuotingList;
