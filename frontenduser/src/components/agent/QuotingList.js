import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Button,
} from "reactstrap";
import ReactTable from "react-table";
import SplitButton from "react-bootstrap/DropdownButton";
import DropdownButton from "react-bootstrap/DropdownButton";
import ButtonGroup from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import IntlMessages from "../../helpers/IntlMessages";
import Pagination from "../DatatablePagination";
import ActionList from "./ActionList";
import { Link, NavLink } from "react-router-dom";
import api from "../../services/api";
import Select from "react-select";

import CustomSelectInput from "../../components/common/CustomSelectInput";
import { getDateWithFormat, sendError } from "../../helpers/Utils";
import { isAgent, TYPES_CHOICES } from "../../helpers/API";
import { successNoti, errorNoti } from "../../helpers/Notifications";
import { Col } from "react-bootstrap";
import {URL_PREFIX} from "../../constants/defaultValues";
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
        ANY
      </option>
      <option style={{ color: "#3e884f" }} value="open">
        OPEN
      </option>
      <option style={{ color: "#c43d4b" }} value="close">
        CLOSED
      </option>
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
      <option value="">ANY</option>
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
      defaultPageSize: 20,
      modal: false,
      quote: {},
      filter_field: "publish",
      filter_type: "-",
      tableState: {},
    };

    this.fetchData = this.fetchData.bind(this);

  }
  static contextType = PusherContext;

  componentDidMount() {
    const pusher = this.context;
    const channelName = 'agent';
    let channel = pusher.channel(channelName);
    if (!channel){
      channel = pusher.subscribe(channelName);
    }
    channel.unbind_all()
    channel.bind('bid_added', (data) => {
      let newQuoteInfo = JSON.parse(data.message);
      let new_data = this.state.data;
      new_data = new_data.map((quote) => {
        if (newQuoteInfo.quote !== quote.id){
          return quote;
        } else {
          quote.total_bids =  newQuoteInfo.bids;
          return quote;
        }
      })
      this.setState({data : new_data})
    });
  }

  componentWillMount() {
    const pusher = this.context;
    const channelName = 'agent';
    let channel = pusher.channel(channelName);
    if (!channel){
      channel = pusher.subscribe(channelName);
    }
    channel.unbind_all()
  }


  fetchData(state, instance) {
    // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
    // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
    this.setState({ loading: true, tableState: state });
    let params = {
      format: "datatables",
      length: state.pageSize,
      start: state.page * state.pageSize,
    };

    state.filtered.map((filter) => {
      params[filter.id] = filter.value;
    });

    params["ordering"] = "";
    /* state.sorted.map((sort) => {
      params['ordering'] += (sort.desc ? '-':'')+sort.id
    })*/
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
      }
    );
  }
  toggle = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  closeQuote = () => {
    let quote = this.state.quote;
    quote.status = "CLOSED";
    api.updateQuote(quote, (err, response) => {
      if ("id" in response) {
        this.setState({ modal: false });
        // this.fetchData();
        successNoti("Quote has been closed");
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

  render() {
    const styles = {
      textAlign: "center",
      color: "white",
      backgroundColor: "#1565c0",
      fontSize: 12,
    };
    const columns = [
      {
        Header: () => <div style={styles}>TITOLO</div>,
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
        Header: () => <div style={styles}>TIPOLOGIA</div>,
        accessor: "types",
        Cell: (props) => (
          <p className="list-item-heading">
            {TYPES_CHOICES.map((type) =>
              type.value === props.value ? type.label : ""
            )}
          </p>
        ),
        Filter: CustomTypeFilter,
        sortable: false,
      },
      {
        Header: () => <div style={styles}>DESTINAZIONE</div>,
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
        Header: () => <div style={styles}>STATUS</div>,
        accessor: "status",
        Cell: (props) => (
          <strong
            className={
              props.value === "CLOSED" ? "text-danger" : "text-success"
            }
          >
            {props.value}
          </strong>
        ),
        Filter: CustomTableFilter_2,
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
        Header: () => <div style={styles}>DATA PUBBLICAZIONE</div>,
        accessor: "publish",
        Cell: (props) => (
          <p className="list-item-heading">
            {props.value
              ? getDateWithFormat(new Date(props.value), "DD-MM-YY")
              : null}
          </p>
        ),
        filterMethod: (filter, row) => {
        },
        Filter: CustomTableFilter,
        filterable: false,
        sortable: false,
      },
      {
        Header: () => <div style={styles}>TERMINE INSERZIONE</div>,
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
        Header: () => <div style={styles}>N. QUOTAZIONI</div>,
        accessor: "total_bids",
        filterable: false,
        Cell: (props) => (
          <p className={props.value === 0 ? "text-danger" : "text-info"}>
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
        accessor: "id",
        filterable: false,
        Cell: (props) => {
          return isAgent() ? (
            <ActionList
              setQuote={(quote) => this.setState({ quote: quote, modal: true })}
              quote={props.original}
            />
          ) : (
            <Link
              className="btn btn-primary btn-sm"
              to={"/" + URL_PREFIX + "/airline/quotes/" + props.value + "/view"}
            >
              View
            </Link>
          );
        },
        Filter: CustomTableFilter,
        sortable: false,
      },
    ];
    const { data, pages, loading, defaultPageSize, page, modal } = this.state;
    return (
      <Card className="h-100">
        <CardBody>
          <CardTitle>
            <Row>
              <Col
                sm={4}
                style={{
                  color: "#FF4500",
                  fontSize: "28px",
                }}
              >
                {isAgent() ? "LE MIE INSERZIONI" : "Quotes"}
              </Col>
              <Col sm={2} className="text-right">
                <span style={{ top: "10px", position: "relative" }}>
                  Ordina:
                </span>
              </Col>
              <Col sm={2}>
                <select
                  className="border-dark form-control"
                  placeholder="search"
                  onChange={(e) => this.changeOrderField(e)}
                  style={{ height: 44 }}
                >
                  <option value="title">Titolo</option>
                  <option value="destination">Destinazione</option>
                  <option selected value="publish">Data Pubblicazione</option>
                  <option value="deadline">Data Termine</option>
                </select>
              </Col>
              <Col sm={2}>
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
              <Col sm={2}>
                {isAgent() ? (
                  <Link
                    to={"/"+URL_PREFIX+"/agent/quotes/create"}
                    className="float-right btn-shadow btn-multiple-state btn btn-primary mr-2 btn-lg"
                  >
                    Crea Inserzione
                  </Link>
                ) : (
                  ""
                )}
              </Col>
            </Row>
          </CardTitle>

          <ReactTable
            className={"agent-quote-table"}
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
            manual
            onSortedChange={(newSort, column) => {
              this.setState({ sorted: newSort });
            }}
            PaginationComponent={Pagination}
          />
        </CardBody>
        <Modal isOpen={modal} toggle={() => this.toggle()}>
          <ModalHeader toggle={() => this.toggle()}>
            Chiudi Inserzione
          </ModalHeader>
          <ModalBody>
            Sei sicuro voler chiudere l'inserzione? L'inserzione resterá
            comunque visibile nella "Lista Inserzioni Chiuse", e la tua
            identita' sara' allora visibile ai vettori che hanno partecipato
            all'inserzione.
          </ModalBody>
          <ModalFooter>
            <Button color="btn-shadow btn-multiple-state btn btn-primary btn-lg" onClick={() => this.closeQuote()}>
              Yes
            </Button>{" "}
            <Button color="btn-shadow btn-multiple-state btn btn-secondary btn-lg" onClick={() => this.toggle()}>
              No
            </Button>
          </ModalFooter>
        </Modal>
      </Card>
    );
  }
}
export default QuotingList;
