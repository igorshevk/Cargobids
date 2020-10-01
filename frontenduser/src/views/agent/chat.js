import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Row } from "reactstrap";

import { Colxx } from "../../components/common/CustomBootstrap";

import {
  getContacts,
  getConversations,
  changeConversation,
  addMessageToConversation
} from "../../redux/actions";
import ChatApplicationMenu from "../../containers/applications/ChatApplicationMenu";
import ChatHeading from "../../components/applications/ChatHeading";
import MessageCard from "../../components/applications/MessageCard";
import SaySomething from "../../components/applications/SaySomething";

import { database } from '../../helpers/Firebase'
const FIREBASE_REF_MESSAGES_LIMIT = 20

class ChatApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuActiveTab: "messages",
      messageInput: "",
      conversations:null
    };
  }

  componentDidMount() {
    const currentUserId = 0;
    this.props.getContacts();
  }

  componentDidUpdate() {
    // if (
    //   !this.props.chatApp.loadingConversations &&
    //   !this.props.chatApp.loadingContacts &&
    //   this.props.chatApp.selectedUser == null
    // ) {
    //   this.props.changeConversation(this.props.chatApp.selectedUserId);
    // }

    if (this._scrollBarRef) {
      this._scrollBarRef._ps.element.scrollTop = this._scrollBarRef._ps.contentHeight;
    }
  }

  handleChatInputPress = e => {
    if (e.key === "Enter") {
      if (this.state.messageInput.length > 0) {
        this.props.addMessageToConversation(
          this.props.chatApp.currentUser.id,
          this.props.chatApp.selectedUser.id,
          this.state.messageInput
        );
        this.setState({
          messageInput: "",
        });
      }
    }
  };

  handleChatInputChange = e => {
    this.setState({
      messageInput: e.target.value
    });
  };

  handleSendButtonClick = () => {
    if (this.state.messageInput.length > 0) {
      this.props.addMessageToConversation(
        this.props.chatApp.currentUser.id,
        this.props.chatApp.selectedUser.id,
        this.state.messageInput
      );
      this.setState({
        messageInput: ""
      });
    }
  };

  toggleAppMenu = tab => {

  };

  getChatItems(data) {
    if (data == null) return []
    const exceptKeys = [
      "enhancer",
      "name",
      "_keysAtom",
      "_data",
      "_hasMap",
      "dehancer",
      "interceptors",
      "changeListeners",
    ]
    let result = []
    Object.keys(data).map(key => {
      if (exceptKeys.indexOf(key) < 0 && key != 'channelInfo') {
        result.push({ ...data[key], key })
      }
    })
    return result
  }

  fetchMessages(userId) {
    const {currentUser} = this.props.chatApp
    const channelName = userId + '-' + currentUser.id
    console.log('channelName', channelName);
    const FIREBASE_REF_MESSAGES = database.ref('message/' + channelName)
    FIREBASE_REF_MESSAGES.limitToLast(FIREBASE_REF_MESSAGES_LIMIT).on('value', (snapshot) => {
      this.setState({ conversations: snapshot.val() })
    }, (errorObject) => {
      console.log(errorObject.message)
    })
  }

  render() {
    const {
      // conversations,
      loadingConversations,
      loadingContacts,
      currentUser,
      selectedUser
    } = this.props.chatApp;
    const {conversations} = this.state

    const { menuActiveTab, messageInput } = this.state;
    const { messages } = this.props.intl;


    const convList = conversations ? this.getChatItems(conversations) : null


    return (
      <Fragment>
        <Row className="app-row">
          <Colxx xxs="12" className="chat-app">
            {!loadingConversations && selectedUser && (
              <ChatHeading
                name={selectedUser.username}
                thumb={selectedUser.thumb}
                lastSeenDate={selectedUser.lastSeenDate}
              />
            )}

            {convList && (
              <PerfectScrollbar
                ref={ref => {
                  this._scrollBarRef = ref;
                }}
                containerRef={ref => { }}
                options={{ suppressScrollX: true, wheelPropagation: false }}>
                {convList.map((item, index) => {
                  const sender = (item.sender == currentUser.id) ? currentUser : selectedUser
                  return (
                    <MessageCard
                      key={index}
                      sender={sender}
                      item={item}
                      currentUserid={currentUser.id}
                    />
                  );
                })}
              </PerfectScrollbar>
            )}
          </Colxx>
        </Row>
        <SaySomething
          placeholder={messages["chat.saysomething"]}
          messageInput={messageInput}
          handleChatInputPress={this.handleChatInputPress}
          handleChatInputChange={this.handleChatInputChange}
          handleSendButtonClick={this.handleSendButtonClick}
        />
        <ChatApplicationMenu
          activeTab={menuActiveTab}
          toggleAppMenu={this.toggleAppMenu}
          onChange={userId => this.fetchMessages(userId)}
        />
      </Fragment>
    )
  }
}

const mapStateToProps = ({ chatApp }) => {
  return { chatApp };
};
export default injectIntl(
  connect(
    mapStateToProps,
    {
      getContacts,
      changeConversation,
      addMessageToConversation
    }
  )(ChatApp)
);
