import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Nav, TabContent, TabPane, CardHeader, NavItem } from "reactstrap";
import { NavLink } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";

import IntlMessages from "../../helpers/IntlMessages";
import ApplicationMenu from "../../components/common/ApplicationMenu";

import {
  changeConversation
} from "../../redux/actions";

class ChatApplicationMenu extends Component {

  toggleAppMenu = tab => {
    if (this.props.activeTab !== tab) {
      this.props.toggleAppMenu(tab)
    }
  };

  handleContactClick = (userId) => {
    const {currentUser} = this.props.chatApp
    this.props.changeConversation(userId);

    setTimeout(()=>{
      this.props.onChange(userId)
    }, 20)
  }


  render() {
    const {
      contacts,
      currentUser
    } = this.props.chatApp;

    return (
      <ApplicationMenu>
        <CardHeader className="pl-0 pr-0">
          <Nav tabs className="card-header-tabs ml-0 mr-0">
            <NavItem className="w-100 text-center">
              <NavLink
                className={classnames({
                  active: this.props.activeTab === "contacts",
                  "nav-link": true
                })}
                onClick={() => {
                  this.toggleAppMenu("contacts");
                }}
                to="#">
                <IntlMessages id="chat.contacts" />
              </NavLink>
            </NavItem>
          </Nav>
        </CardHeader>


          <TabPane tabId="contacts" className="chat-app-tab-pane">
            <PerfectScrollbar
              options={{ suppressScrollX: true, wheelPropagation: false }}
            >
              <div className="pt-2 pr-4 pl-4 pb-2">
                {contacts && contacts.filter(item=>item.id!=currentUser.id)
                    .map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="d-flex flex-row mb-3 border-bottom pb-3"
                        >
                          <NavLink
                            className="d-flex"
                            to="#"
                            onClick={()=>this.handleContactClick(item.id)}
                          >
                          {item.thumb && <img
                            alt={item.username}
                            src={item.thumb}
                            className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall"
                          />}
                          {!item.thumb && <img
                            alt="empty-avatar"
                            src="/static/assets/img/empty-avatar.jpg"
                            className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall"
                          />}
                            <div className="d-flex flex-grow-1 min-width-zero">
                              <div className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                <div className="min-width-zero">
                                  <p className="mb-0 truncate">{item.username}</p>
                                </div>
                              </div>
                            </div>
                          </NavLink>
                        </div>
                      );
                    })}
              </div>
            </PerfectScrollbar>
          </TabPane>
      </ApplicationMenu>
    );
  }
}

const mapStateToProps = ({ chatApp }) => {
  return { chatApp };
};
export default injectIntl(
  connect(
    mapStateToProps,
    {
      changeConversation
    }
  )(ChatApplicationMenu)
);
