import React, { Component} from "react";
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import Icofont from 'react-icofont';
import { getUser, setLocalStorageUser } from '../../helpers/API';
import { getDateWithFormat } from '../../helpers/Utils'
import { URL_PREFIX } from '../../constants/defaultValues';
import {Link} from "react-router-dom";
import api from "../../services/api";

const NotificationItem = (props) => {
  let notifiy_msg = '', link = '';
  if(props.verb === 'Quote Closed') {
      notifiy_msg = `Quote ${props.target.title} has been closed`
      if(props.target !== null)
        link = `/${URL_PREFIX}/agent/quotes/${props.target.slug}/view`
      else
        link = '';
  } else if(props.verb === 'New Bid') {
      notifiy_msg = `New bid recieved`
      if(props.target !== null)
        link = `/${URL_PREFIX}/agent/quotes/${props.target.quote.slug}/bids/${props.target.id}/detail/`
      else
        link = '';
  } else if(props.verb === 'Rank Changed') {
      notifiy_msg = `Your bid rank changed`
      if(props.target !== null)
        link = `/${URL_PREFIX}/agent/quotes/${props.target.slug}/view/`
       else
          link = '';
  } else if(props.verb === 'Bid Updated') {
      notifiy_msg = `1 bid has been updated`
      if(props.target !== null)
        link = `/${URL_PREFIX}/agent/quotes/${props.target.quote.slug}/bids/${props.target.id}/detail/`
      else
        link = '';
  } else if(props.verb === 'Bid Cancelled') {
      notifiy_msg = `1 Bid has been cancelled`
      if(props.target !== null)
        link = `/${URL_PREFIX}/agent/quotes/${props.target.quote.slug}/bids/${props.target.id}/detail/`;
      else
        link = '';
  } 
  return (
    <div className="d-flex flex-row mb-3 pb-3 border-bottom">
      <div className="">
          <Link to={link}><p className="font-weight-medium mb-1">{notifiy_msg}</p> </Link>
          <p className="text-muted mb-0 text-small">
          <i style={{fontSize: "14px", top: "4px", position: "relative"}}>{getDateWithFormat(new Date(props.timestamp))}</i>
          <Icofont icon={"close-circled"} onClick={(e) => props.deleteNotification(props.id)} style={{fontSize:"18px"}} className="float-right" /></p>
      </div>
    </div>
  );
};

class TopnavChat extends Component  {

  constructor(props) {
    super(props);
    
    this.state = {
      notifications: [],
      unread_notifications : 0,
    }
  }

  updateNotifications = () => {
    let user = getUser();
    let notifications = user !== null ? user.notifications: [];
    notifications = notifications === undefined ? [] : notifications;
    this.setState({
      notifications:notifications,
      unread_notifications:notifications.filter(n => n.unread).length
    }, () => {
      user.notifications = notifications;
      setLocalStorageUser(user);
    })
  }

  componentDidMount() {
    this.updateNotifications();
  }

  markAsRead = () => {
    this.updateNotifications();

    if(this.state.unread_notifications > 0) {

    let new_notifications = this.state.notifications.map(n => {
      n.unread = false
      return n;
    })
    this.setState({notifications:new_notifications}, () => {
      let user = getUser();
      user.notifications = new_notifications;
      setLocalStorageUser(user);
    })

      api.post('notifications/mark_all_as_read', {}, (response) => {
        this.setState({unread_notifications:0})
      })
    }
  }

  deleteNotification = (id) => {
    let new_notifications = this.state.notifications.filter(n => n.id !== id)
    this.setState({notifications:new_notifications}, () => {
      let user = getUser();
      user.notifications = new_notifications;
      setLocalStorageUser(user);
    })
    api.delete(`notifications/${id}/delete`, (response) => {
      return true;
    })
  }

  render() {

    let {notifications, unread_notifications} = this.state;
    return (
      <div className="position-relative d-inline-block">
        <UncontrolledDropdown className="dropdown-menu-right">
          <DropdownToggle
            className="header-icon notificationButton"
            color="empty"
            onClick={(e) => this.markAsRead()}
          >
            <Icofont icon={"icofont-wechat"} />
            {unread_notifications > 0 ? <span className="count">{unread_notifications}</span>:<></>}
          </DropdownToggle>
          <DropdownMenu
            className="position-absolute mt-3 scroll"
            right
            id="notificationDropdown"
          >
            <PerfectScrollbar
              options={{ suppressScrollX: true, wheelPropagation: false }}
            >
              {notifications.map((notification, index) => {
                console.log("notification lenght : ", notifications.length)
                return <NotificationItem deleteNotification={this.deleteNotification} key={index} {...notification} />;
              })}

              {notifications.length === 0 ? 
              <div className="d-flex flex-row mb-3 pb-3 border-bottom">
                  <div className="">
                      <p className="font-weight-medium mb-1">No notification! </p>
                  </div>
                </div>:<></>
              }
            </PerfectScrollbar>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    );
  }
};

export default TopnavChat;
