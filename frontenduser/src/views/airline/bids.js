import React, { Component, Fragment } from "react";
import {
  Row,
  Card,
  CardBody
} from "reactstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import { Colxx } from "../../components/common/CustomBootstrap";
import { injectIntl } from "react-intl";
import BidList from "../../components/airline/BidList";

class Bids extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    { }
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <h1>Bids</h1>
          </Colxx>
        </Row>

        <Row>
          <Colxx xl="12" lg="12" className="mb-4">
            <BidList />
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}
export default injectIntl(Bids);
