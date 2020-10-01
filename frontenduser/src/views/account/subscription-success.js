import React, { Component, Fragment } from "react";
import {
  Row,
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  FormGroup,
  Tooltip,
  Label,
  CustomInput,
  FormText,
  Form,
} from "reactstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import { Separator, Colxx } from "../../components/common/CustomBootstrap";
//import { pricesData } from "../../data/prices";
import PriceCard from "../../components/cards/PriceCard";
import PricingCard from "../../components/cards/PricingCard";
import IntlMessages from "../../helpers/IntlMessages";
import { injectIntl } from "react-intl";
import { defaultLocale, URL_PREFIX } from "../../constants/defaultValues";
import api from "../../services/api";
import {
  getUser,
  isAgent,
  isShowWelcome,
  isAirline,
  setLocalStorageUser,
  isSubscribed,
  PLAN_IDS,
  PLAN_DURATIONS,
} from "../../helpers/API";
import CheckoutForm from "../../components/cards/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { successNoti, errorNoti } from "../../helpers/Notifications";
import { sendError, getDateWithFormat } from "../../helpers/Utils";
import "../../assets/css/pricing/style.css";

const locale = localStorage.getItem("currentLanguage") || defaultLocale;
class Prices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: getUser(),
      company: isAirline()
        ? getUser().airline_company
        : getUser().agent_company,
      exception_note: null,
    };
  }

  componentDidMount = () => {
    if (!isSubscribed()) {
      if (isAgent())
        this.props.history.push("/" + URL_PREFIX + "/agent/membership");
      else this.props.history.push("/" + URL_PREFIX + "/airline/membership");
    } else if (!isShowWelcome()) {
      if (isAgent())
        this.props.history.push("/" + URL_PREFIX + "/agent/dashboard");
      else this.props.history.push("/" + URL_PREFIX + "/airline/dashboard");
    }
  };

  confirmSubscription = () => {
    api.patch(
      "subscriptions/" + this.state.user.subscription.id + "/",
      { is_confirmed: true, exception_note: this.state.exception_note },
      (err, response) => {
        successNoti("Your subscription has been confirmed");
        let user = this.state.user;
        user.subscription.is_confirmed = true;
        localStorage.setItem("persist:cargobid-auth", JSON.stringify(user));
        if (isAgent())
          this.props.history.push("/" + URL_PREFIX + "/agent/dashboard");
        else this.props.history.push("/" + URL_PREFIX + "/airline/dashboard");
      }
    );
  };

  render() {
    const { user, company } = this.state;
    return (
      <Fragment>
        <Row className="hidden">
          <Colxx xxs="12">
            <Breadcrumb heading="menu.prices" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row className="equal-height-container mb-5">
          <Colxx xxs="12" className="text-center" style={{ color: "#ff4500" }}>
            <h1>
              Benvenuto {user.firstname} {user.lastname}!
            </h1>
          </Colxx>
          <Colxx xxs="12" className="text-center mb-4">
            <h3>
              La procedura di abbonamento é stata finalizzata! <br />
              L'abbonamento resterá valido fino al .
              {getDateWithFormat(
                new Date(user.subscription.current_period_end)
              )}
              . <br /> <br /> <hr />
              In caso di procedura di rinnovo, la data termine dell'abbonamento
              verrá modificata correttamente (riceverai comunicazione tramite
              email). Ti preghiamo confermare che i seguenti dati per la
              fatturazione siano corretti:
            </h3>
            <br />
          </Colxx>
          <Colxx xxs="12" md={4} style={{ margin: "0 auto" }} className="mb-4">
            {
              <strong className="row">
                <span className="col-sm-8">Modalitá di Pagamento: </span>
                <span className="col-sm-4">Credit Card </span>
                <span className="col-sm-8">Nome : </span>
                <span className="col-sm-4">
                  {user.firstname} {user.lastname}
                </span>
                <span className="col-sm-8">Email : </span>
                <span className="col-sm-4">{user.email}</span>
                <span className="col-sm-8">Azienda : </span>
                <span className="col-sm-4">
                  {isAirline()
                    ? user.airline_company.airline_company_name
                    : user.agent_company.agent_company_name}{" "}
                </span>
                <span className="col-sm-8">Indirizzo : </span>
                <span className="col-sm-4">{company.address_1} </span>
                <span className="col-sm-8">Zip : </span>
                <span className="col-sm-4">{company.zip_code}</span>
                <span className="col-sm-8">Piva :</span>
                <span className="col-sm-4">{company.p_iva}</span>
                <span className="col-sm-8">CF :</span>
                <span className="col-sm-4">{company.cf}</span>
                <span className="col-sm-8">SDI :</span>
                <span className="col-sm-4">{company.sdi}</span>
              </strong>
            }
            <Form>
              <br />
              <h6
                className="form-group has-float-label mb-2"
                style={{ color: "red", textAlign: "center" }}
              >
                Nel caso i suddetti dati non fossero corretti, ti preghiamo
                inserire i nuovi dati nello spazio sottostante:
              </h6>
              <Input
                type="textarea"
                onChange={(e) =>
                  this.setState({ exception_note: e.target.value })
                }
              />
            </Form>
          </Colxx>
          <Colxx xxs="12" className="text-center mb-4">
            <a
              className="btn-shadow btn-multiple-state btn btn-primary btn-lg text-white"
              onClick={() => this.confirmSubscription()}
            >
              INVIA
            </a>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}
export default injectIntl(Prices);
