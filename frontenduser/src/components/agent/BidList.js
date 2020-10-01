import React, { Component } from "react";
import {
  Card, CardBody, CardTitle, Modal, ModalHeader,
  ModalBody, ModalFooter, Button
} from "reactstrap";
import ReactTable from "react-table";
import moment from "moment";
import IntlMessages from "../../helpers/IntlMessages";
import Pagination from "../DatatablePagination";
import ActionList from "./ActionList";
import { Link, NavLink } from "react-router-dom";
import api from "../../services/api";
import { getDateWithFormat, sendError } from '../../helpers/Utils';
import { isAgent } from '../../helpers/API';
import { successNoti, errorNoti } from '../../helpers/Notifications';
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
class BidList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],

      pages: null,
      loading: true,
      sorted: [],
      defaultPageSize: 10,
      modal: false,
      quote_id: 0,
    };

    this.fetchData = this.fetchData.bind(this);
  }
  static contextType = PusherContext;

  componentDidMount() {
    const pusher = this.context
    const channelName = 'agent' + this.props.quote.id
    let channel = pusher.channel(channelName);
    if (!channel) {
      channel = pusher.subscribe(channelName);
    }
    channel.bind('bid' + this.props.quote.id, function (data) {
      this.fireFetchData()
    }.bind(this.refs.table));
  }

  componentWillUnmount() {
    const pusher = this.context
    const channelName = 'agent' + this.props.quote.id
    let channel = pusher.channel(channelName);
    channel.unbind_all()
  }

  fetchData(state, instance) {
    console.log(state);
    // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
    // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
    this.setState({ loading: true });
    let params = {
      format: 'datatables',
      length: state.pageSize,
      start: state.page * state.pageSize,
      // page: state.page + 1
    }
    state.filtered.map((filter) => {
      params[filter.id] = filter.value;
    });
    params["quote"] = this.props.quote.id;
    params["ordering"] = "";
    state.sorted.map((sort) => {
      params["ordering"] += sort.desc ? "-" : "";
    });

    // Request the data however you want.  Here, we'll use our mocked service we created earlier
    api.list("bids", params, (err, res) => {
      // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
      this.setState({
        data: res.data,
        pages: Math.ceil(res.recordsFiltered / state.pageSize),
        loading: false,
      });
    });
  }
  toggle = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  getTrProps = (state, rowInfo, instance) => {
    let returnVal = {
      onClick: () =>
        this.props.moreProps.history.push(
          "/" +
          URL_PREFIX +
          "/agent/quotes/" +
          rowInfo.original.quote_slug +
          "/bids/" +
          rowInfo.original.id +
          "/detail/"
        ),
    };
    return returnVal;
  };

  render() {
    console.log(data);
    const columns = [
      {
        Header: () => <div style={{
          textAlign: "left",
          color: "#ff4500",
        }}>VETTORE</div>,
        accessor: "carrier",
        filterable: false,
        Cell: (props) => <h2 className="list-item-heading" style={{ textAlign: "left" }}>{props.value}</h2>,
        Filter: CustomTableFilter,
      },
      {
        Header: () => <div style={{
          textAlign: "center",
          color: "#ff4500",
        }}>LOGO</div>,
        accessor: "carrier_logo",
        filterable: false,
        Cell: (props) => (
          <p className="list-item-heading" style={{ lineHeight: "46px" }}>
            <img
              style={{ maxHeight: "50px", width: "100px" }}
              onError={(e) =>
                (e.target.src = "/static/assets/img/carriers/default.png")
              }
              src={
                "/static/assets/img/carriers/" +
                props.original.carrier.toUpperCase() +
                ".png"
              }
            />
          </p>
        ),
        Filter: CustomTableFilter,
        getProps: (state, rowInfo, column) => {
          return {
            style: {
              padding: 0,
            },
          };
        },
      },
      {
        Header: () => <div style={{
          textAlign: "center",
          color: "#ff4500",
        }}>TARIFFA</div>,
        accessor: "rate",
        filterable: false,
        Cell: (props) => <p className="list-item-heading">{props.value}</p>,
        Filter: CustomTableFilter,
      },
      {
        Header: () => <div style={{
          textAlign: "center",
          color: "#ff4500",
        }}>SURCHARGES</div>,
        accessor: "surcharges",
        filterable: false,
        Cell: (props) => <p className="list-item-heading">{props.value}</p>,
        Filter: CustomTableFilter,
      },
      {
        Header: () => <div style={{
          textAlign: "center",
          color: "#ff4500",
        }}>CHBL.WEIGHT</div>,
        accessor: "cw_required",
        filterable: false,
        Cell: (props) => <p className="list-item-heading">{props.value}</p>,
        Filter: CustomTableFilter,
      },
      {
        Header: () => <div style={{
          textAlign: "center",
          color: "#ff4500",
        }}>USERNAME</div>,
        accessor: "author.user",
        filterable: false,
        Cell: (props) => (
          <p className="list-item-heading">
            {(props.original.author.firstname
              ? props.original.author.firstname
              : "") +
              " " +
              (props.original.author.lastname
                ? props.original.author.lastname
                : "")}
          </p>
        ),
        Filter: CustomTableFilter,
      },
      {
        Header: () => <div style={{
          textAlign: "center",
          color: "#ff4500",
        }}>EMAIL</div>,
        accessor: "author.email",
        filterable: false,
        Cell: (props) => (
          <p className="list-item-heading">
            {props.original.author.email ? props.original.author.email : ""}
          </p>
        ),
        Filter: CustomTableFilter,
      },
      {
        Header: () => <div style={{ textAlign: "right", color: "#ff4500" }}>STATUS</div>,
        accessor: "status",
        filterable: false,
        Cell: props => <p style={props.value === 'DELETED' ? { color: 'grey', textAlign: "right" } : { textAlign: "right" }} className={props.value === 'OPEN' ? "list-item-heading text-success" : "list-item-heading"
        } > <strong>{props.value === 'DELETED' ? 'VOIDED' : props.value}</strong></p >,
        Filter: CustomTableFilter
      },
    ];
    const { data, pages, loading, defaultPageSize, page, modal } = this.state;
    return (
      <Card className="h-100">
        <CardBody style={{ padding: 0 }}>
          <CardTitle
            style={{
              backgroundColor: "#1565c0",
              borderColor: "#9400D3",
              color: "white",
            }}
          >
            <span style={{ marginLeft: "14px" }}>QUOTAZIONI RICEVUTE</span>
          </CardTitle>
          <ReactTable style={{ width: '100%' }}
            ref="table"
            className={'agent-bid-table'}
            columns={columns}
            manual // Forces table not to paginate or sort automatically, so we can handle it server-side
            data={data}
            filterable
            defaultFilterMethod={(filter, row) =>
              String(row[filter.id]) === filter.value}
            pages={pages} // Display the total number of pages
            loading={loading} // Display the loading overlay when we need it
            onFetchData={this.fetchData} // Request new data when things change
            sorted={this.state.sorted}
            defaultPageSize={defaultPageSize}
            manual
            showPagination={false}
            getTrProps={this.getTrProps}
            onSortedChange={(newSort, column) => {
              this.setState({ sorted: newSort });
            }}
            PaginationComponent={Pagination}
          />
        </CardBody>
      </Card>
    );
  }
}
export default BidList;