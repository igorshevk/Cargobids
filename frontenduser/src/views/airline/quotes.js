import React, { Component, Fragment } from "react";
import {
  CardBody,
  Nav, NavItem, NavLink,
  Row,
} from "reactstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import { Colxx } from "../../components/common/CustomBootstrap";
import { injectIntl } from "react-intl";
import QuotingList from "../../components/airline/QuoteList";
import IntlMessages from "../../helpers/IntlMessages";

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

            <QuotingList moreProps={this.props} />
          </Colxx>
        </Row>

      </Fragment>
    );
  }
}
export default injectIntl(Quotes);

//
//import React, { Component, Fragment } from "react";
//import {
//  Row,
//} from "reactstrap";
//import Breadcrumb from "../../containers/navs/Breadcrumb";
//import { Colxx } from "../../components/common/CustomBootstrap";
//import { injectIntl } from "react-intl";
//import QuotingList from "../../components/agent/QuotingList";
//import api from "../../services/api";
//class Quotes extends Component {
//  constructor(props) {
//    super(props);
//
//    this.state = {
//
//    };
//  }
//
//  render() {
//   let data = {
//                 customer_id : 'cus_Gnc9gJ8pyIotiA',
//              }
//    return (
//      <Fragment>
//
//
//
//
//        <Row>
//           <Colxx xl="12" lg="12" className="mb-4">
//                {
//
//                api.customer(data,(err, response)=>{
//                  if(response){
//                       console.log(response);
//                     var tifOptions = Object.keys(response).map(function(key) {
//                            console.log(key);
//                             let res = response[key];
//                        })
//                  }else{
//                    console.log(err);
//                  }
//
//               })
//                }
//
//           </Colxx>
//        </Row>
//
//      </Fragment>
//    );
//  }
//}
//export default injectIntl(Quotes);
