import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { ButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle} from "reactstrap";
import IntlMessages from "../../helpers/IntlMessages";
import { injectIntl } from "react-intl";
import {isAgent} from '../../helpers/API';
import api from "../../services/api";
import {successNoti} from "../../helpers/Notifications";
import {URL_PREFIX} from "../../constants/defaultValues";

class ActionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownSplitOpen: false,
    };
  }

  toggleSplit =()=> {
    this.setState(prevState => ({
      dropdownSplitOpen: !prevState.dropdownSplitOpen
    }));
  }

  componentDidMount(){

  }

  viewQuote = () => {
    if(isAgent())
      this.props.history.push("/"+URL_PREFIX+`/agent/quotes/${this.props.quote.slug}/view`)
    else
      this.props.history.push("/"+URL_PREFIX+`/airline/quotes/${this.props.quote.slug}/view`)
  }

  editQuote = () => {
    this.props.history.push("/"+URL_PREFIX+`/agent/quotes/${this.props.quote.slug}/update`)
  }

  render() {
    const { dropdownSplitOpen } = this.state;
    return (
      <div>
        <div className="custom-control custom-checkbox pl-1 align-self-center pr-4">
          <ButtonDropdown 
            isOpen={dropdownSplitOpen}
            toggle={this.toggleSplit}>
            <DropdownToggle caret color={this.props.quoteScope && this.props.quoteScope !=='all' ? "default":'primary'} style={{"margin":"0 auto","height":"23px", "padding":"1.5px 10px 4px 10px",fontSize:11}}>
              Action
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem onClick={() => this.viewQuote()}>View</DropdownItem>
              {this.props.quote.publish === null ? 
              <DropdownItem onClick={() => this.editQuote()}>Edit</DropdownItem>
              :''}
              {this.props.quote.bid ?
                  <DropdownItem onClick={() => this.props.setBid(this.props.quote.bid)}>Delete</DropdownItem>
                  :''}
              {this.props.quote.status !== 'CLOSED' && isAgent() ? 
              <DropdownItem onClick={() => this.props.setQuote(this.props.quote)}>Close</DropdownItem>
              :''}
            </DropdownMenu>
          </ButtonDropdown>
        </div>

      </div>
    );
  }
}

export default withRouter(ActionList);
