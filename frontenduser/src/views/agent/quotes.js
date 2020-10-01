import React, { Component, Fragment } from "react";
import {
  Row,
} from "reactstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import { Colxx } from "../../components/common/CustomBootstrap";
import { injectIntl } from "react-intl";
import QuotingList from "../../components/agent/QuotingList";

class Quotes extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <Fragment>

        <Row>
          <Colxx xl="12" lg="12" className="mb-4">
            <QuotingList />
          </Colxx>
        </Row>

      </Fragment>
    );
  }
}
export default injectIntl(Quotes);
