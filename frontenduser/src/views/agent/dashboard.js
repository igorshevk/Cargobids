import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import Logs from "../../containers/dashboards/Logs";
import Tickets from "../../containers/dashboards/Tickets";
// import MessageList from '../../containers/dashboards/MessageList';
import GradientWithRadialProgressCard from "../../components/cards/GradientWithRadialProgressCard";
import SortableStaticticsRow from "../../containers/dashboards/SortableStaticticsRow";
import SmallLineCharts from "../../containers/dashboards/SmallLineCharts";
import ProductCategoriesPolarArea from "../../containers/dashboards/ProductCategoriesPolarArea";
import WebsiteVisitsChartCard from "../../containers/dashboards/WebsiteVisitsChartCard";

import {
  Row,
  Card,
  CardBody,
  CardTitle,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

import IntlMessages from "../../helpers/IntlMessages";
import api from "../../services/api";
import { successNoti, errorNoti } from "../../helpers/Notifications";
import {
  getUser,
  isAgent,
  isAirline,
  setLocalStorageUser,
  isSubscribed,
  isShowWelcome,
} from "../../helpers/API";
import { getDateWithFormat } from "../../helpers/Utils";
import { URL_PREFIX } from "../../constants/defaultValues";

class DefaultDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      canCancel: false,
      trial: false,
      users: getUser(),
      trial_end_date: getDateWithFormat(new Date()),
    };
    console.log("props is", this.props);
  }
  toggle = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  CancelSubscriptions = async (event) => {
    let user_data = {
      user_id: this.state.users.user_id,
    };
    api.cancelsubscriptions(user_data, (err, response) => {
      if (response) {
        console.log("response is ", response);
        let user = getUser();
        user.subscription = null;
        setLocalStorageUser(user);
        this.setState({ modal: false, users: user });
        // this.renderCancelSubscription();
        if (isAgent())
          this.props.history.push("/" + URL_PREFIX + "/agent/membership");
        else this.props.history.push("/" + URL_PREFIX + "/airline/membership");
        //successNoti('Subscription has been canceled successfully!');
      } else {
        this.setState({ modal: false });
        errorNoti("Subscription cancel request failed Please try again!");
      }
    });
  };

  addDaysToDate(date, days) {
    var date = new Date(date);
    date.setDate(date.getDate() + days);
    return date;
  }

  componentDidMount = () => {
    if (!isSubscribed()) {
      if (isAgent())
        this.props.history.push("/" + URL_PREFIX + "/agent/membership");
      else this.props.history.push("/" + URL_PREFIX + "/airline/membership");
    } else if (isShowWelcome()) {
      if (isAgent())
        this.props.history.push("/" + URL_PREFIX + "/agent/welcome");
      else this.props.history.push("/" + URL_PREFIX + "/airline/welcome");
    }
  };

  // renderCancelSubscription() {
  //   if(this.state.users.subscription !== null) {
  //     let canCancel = true, trial =false;
  //     let trial_end_date = this.addDaysToDate(this.state.users.subscription.current_period_start, this.state.users.subscription.trial_period - 1);

  //     if(this.state.users.subscription.canceled_by_user ||  (trial_end_date <= new Date()))
  //       canCancel = false;

  //     if(trial_end_date <= new Date() && this.state.users.subscription.trial === 1)
  //       trial = true;

  //     this.setState({trial_end_date:getDateWithFormat(trial_end_date), canCancel:canCancel, trial:trial})
  //   }
  // }

  render() {
    const { canCancel, trial_end_date, trial } = this.state;

    const { messages } = this.props.intl;
    return this.state.users.subscription !== null ? (
      <Fragment>
        <Row>
          <Colxx
            xxs="12"
            style={{
              color: "#FF4500",
            }}
          >
            <h1>
              <span>
                DASHBOARD <br />
                {this.state.users.firstname + " " + this.state.users.lastname}
              </span>
            </h1>
          </Colxx>
        </Row>
        <Row>
          <Colxx lg="12" md="12" xl="12">
            <Row>
              <Colxx lg="3" xl="3" className="mb-3">
                <GradientWithRadialProgressCard
                  icon="iconsminds-clock"
                  title="13 Quotes "
                  detail={messages["dashboards.pending-for-print"]}
                  percent={(5 * 100) / 12}
                  progressText="5/12"
                />
              </Colxx>
              <Colxx lg="3" xl="3" className="mb-3">
                <GradientWithRadialProgressCard
                  icon="iconsminds-male"
                  title="33 Bids"
                  detail={messages["dashboards.on-approval-process"]}
                  percent={(4 * 100) / 6}
                  progressText="4/6"
                />
              </Colxx>
              <Colxx lg="3" xl="3" className="mb-3">
                <GradientWithRadialProgressCard
                  icon="iconsminds-bell"
                  title="233 Messages"
                  detail={messages["dashboards.waiting-for-notice"]}
                  percent={(8 * 100) / 10}
                  progressText="8/10"
                />
              </Colxx>
              <Colxx lg="3" xl="3" className="mb-3">
                <Card className="progress-banner">
                  <CardBody className="justify-content-between d-flex flex-row align-items-center">
                    <div className="col-sm-12">
                      {canCancel || trial ? (
                        <div>
                          <p className="lead text-white">Periodo di Prova</p>
                          <p className="text-small text-white">
                            Data fine periodo di prova:{" "}
                            {this.state.trial_end_date}
                          </p>
                          {canCancel ? (
                            <button
                              class="mb-2 btn-shadow btn-multiple-state btn btn-danger btn-lg"
                              outline
                              onClick={this.toggle}
                            >
                              {" "}
                              <span> Cancella Iscrizione</span>
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        <div>
                          <h1 className="lead text-white"> Iscrizione </h1>
                          <br />
                          <h2 className="text-small text-white">
                            Valida fino al{" "}
                            {getDateWithFormat(
                              new Date(this.state.users.subscription.cancel_at)
                            )}
                          </h2>

                          {this.state.users.days_left < 7 ? (
                            <button
                              onClick={this.toggle}
                              className="btn text-small btn-danger btn-lg btn-shadow btn-multiple-state text-white col-sm-12"
                            >
                              Il tuo piano tariffario é in scadenza!
                              <br /> Clicca qui per rinnovare. <br />
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      )}
                    </div>
                    <Modal isOpen={this.state.modal} toggle={this.toggle}>
                      <ModalHeader toggle={this.toggle}>
                        Rinnova il tuo abbonamento!
                      </ModalHeader>
                      <ModalBody>
                        Restano {this.state.users.days_left} giorni al termine
                        del piano sottoscritto.Vuoi procedere al rinnovo
                        dell'abbonamento?
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="primary"
                          className="btn-shadow btn-multiple-state btn btn-primary btn-lg"
                          onClick={() => this.CancelSubscriptions()}
                        >
                          Si
                        </Button>{" "}
                        <Button
                          color="secondary"
                          className="btn-shadow btn-multiple-state btn btn-secondary btn-lg"
                          onClick={this.toggle}
                        >
                          No
                        </Button>
                      </ModalFooter>
                    </Modal>
                  </CardBody>
                </Card>
              </Colxx>
            </Row>
          </Colxx>
        </Row>
        <Row></Row>
        <Row>
          <Colxx sm="12" md="6" className="mb-4">
            <WebsiteVisitsChartCard />
          </Colxx>
          <Colxx sm="12" md="6" className="mb-4">
            <Tickets />
          </Colxx>
        </Row>
        <SortableStaticticsRow messages={messages} />
        <Row>
          <Colxx lg="4" md="12" className="mb-4">
            <ProductCategoriesPolarArea chartClass="dashboard-donut-chart" />
          </Colxx>
          <Colxx lg="4" md="6" className="mb-4">
            <Logs />
          </Colxx>
          <Colxx lg="4" md="6" className="mb-4"></Colxx>
        </Row>
      </Fragment>
    ) : (
      <></>
    );
  }
}
export default injectIntl(DefaultDashboard);
