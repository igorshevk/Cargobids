import React, { Component } from "react";
import { connect } from "react-redux";
import { NavItem, Badge } from "reactstrap";
import { NavLink } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";

import IntlMessages from "../../helpers/IntlMessages";
import ApplicationMenu from "../../components/common/ApplicationMenu";
import { getTodoListWithFilter } from "../../redux/actions";
class TodoApplicationMenu extends Component {
  constructor(props) {
    super();
  }

  addFilter = (column, value) => {
    this.props.getTodoListWithFilter(column, value);
  };

  render() {
    const {
      todoItems,
      filter,
      allTodoItems,
      loading,
      labels,
      categories
    } = this.props.todoApp;

    return (
      <ApplicationMenu>
        <PerfectScrollbar
          options={{ suppressScrollX: true, wheelPropagation: false }}
        >
          <div className="p-4">
            <p className="text-muted text-small">
              <IntlMessages id="todo.status" />
            </p>
            <ul className="list-unstyled mb-5">
              <NavItem className={classnames({ active: !filter })}>
                <NavLink to="#" onClick={e => this.addFilter("", "")}>
                  <i className="simple-icon-reload" />
                  All Notifications
                  <span className="float-right">
                    {loading && allTodoItems.length}
                  </span>
                </NavLink>
              </NavItem>
              <NavItem
                className={classnames({
                  active:
                    filter &&
                    filter.column === "status" &&
                    filter.value === "PENDING"
                })}>
                <NavLink
                  to="#"
                  onClick={e => this.addFilter("status", "PENDING")}>
                  <i className="simple-icon-refresh" />
                  Unread Notifications
                  <span className="float-right">
                    {loading &&
                      todoItems.filter(x => x.status === "PENDING").length}
                  </span>
                </NavLink>
              </NavItem>
              <NavItem
                className={classnames({
                  active:
                    filter &&
                    filter.column === "status" &&
                    filter.value === "COMPLETED"
                })}>
                <NavLink
                  to="#"
                  onClick={e => this.addFilter("status", "COMPLETED")}>
                  <i className="simple-icon-check" />
                  Read Notifications
                  <span className="float-right">
                    {loading &&
                      todoItems.filter(x => x.status === "COMPLETED").length}
                  </span>
                </NavLink>
              </NavItem>
            </ul>
            
            <p className="text-muted text-small">
              <IntlMessages id="todo.labels" />
            </p>
            <div>
              {labels.map((l, index) => {
                return (
                  <p className="d-sm-inline-block mb-1" key={index}>
                    <NavLink
                      to="#"
                      onClick={e => this.addFilter("label", l.label)}
                    >
                      <Badge
                        className="mb-1"
                        color={`${
                          filter &&
                          filter.column === "label" &&
                          filter.value === l.label
                            ? l.color
                            : "outline-" + l.color
                        }`}
                        pill
                      >
                        {l.label}
                      </Badge>
                    </NavLink>
                  </p>
                );
              })}
            </div>
          </div>
        </PerfectScrollbar>
      </ApplicationMenu>
    );
  }
}

const mapStateToProps = ({ todoApp }) => {
  return {
    todoApp
  };
};
export default connect(
  mapStateToProps,
  {
    getTodoListWithFilter
  }
)(TodoApplicationMenu);
