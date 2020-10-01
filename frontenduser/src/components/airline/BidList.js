import React from "react";
import { Button, Card, CardBody, CardTitle } from "reactstrap";
import ReactTable from "react-table";

import IntlMessages from "../../helpers/IntlMessages";
import Pagination from "../DatatablePagination";

import data from "../../data/bids";

const QuotingList = ({title="Bids"}) => {
  const columns = [
    {
      Header: "AIRLINE",
      accessor: "airline",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: "EMAIL",
      accessor: "email",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: "RATE",
      accessor: "rate",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: "NOTE",
      accessor: "note",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: "REPLY",
      accessor: "reply",
      Cell: props => <Button color="success" className="btn-shadow btn-multiple-state btn btn-success btn-lg">Bid</Button>
    }
  ];
  return (
    <Card className="h-100">
      <CardBody>
        <CardTitle>
          <IntlMessages id={title} />
        </CardTitle>
        <ReactTable
          defaultPageSize={5}
          data={data.slice(0, 12)}
          columns={columns}
          minRows={0}
          showPageJump={false}
          showPageSizeOptions={false}
          PaginationComponent={Pagination}
        />
      </CardBody>
    </Card>
  );
};
export default QuotingList;
