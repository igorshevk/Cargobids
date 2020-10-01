import React, { Component } from "react";
import { Row, Card, CardTitle, Label, FormGroup, Button } from "reactstrap";
import { NavLink, withRouter } from "react-router-dom";
import { successNoti, errorNoti } from "../../helpers/Notifications";
import { Formik, Form, Field } from "formik";
import { loginUser, login2FAVerify } from "../../redux/actions";
import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";
import api from "../../services/api";
// import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import { ACCOUNT_AGENT, ACCOUNT_AIRLINE } from "../../redux/actions";

import { login } from "../../helpers/Auth";
import { validateEmail } from "../../helpers/Utils";
import { URL_PREFIX } from "../../constants/defaultValues";
import { PusherContext } from "../../context";

// toast.configure();
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      id: null,
      code2FA: null,
      isAuthenticated: false,
    };
    this.onUserLogin = this.onUserLogin.bind(this);
  }
  static contextType = PusherContext;

  componentDidMount = () => {
    const pusher = this.context;
    const channel = pusher.subscribe("airline");

    channel.bind("e2", function (data) {
      alert("An event was triggered with message: " + data.message);
    });

    console.log("hello world");
  };

  onUserLogin = () => {
    let { email, password } = this.state;
    if (!this.props.loading) {
      if (email && password) {
        this.props.loginUser(
          { email, password },
          this.props.history,
          (err, res) => {
            console.log(res);
            if (res && res.data) {
              //If a response
              if (res.data.groups.indexOf("Admin") > -1) {
                errorNoti("Non hai il permesso di effettuare il Login");
              } else {
                let {
                  data: { id, firstname, lastname },
                } = res;
                this.setState({ id, isAuthenticated: true });
              }
            }
          }
        );
      }
    }
  };

  verify2FA = (code2FA) => {
    if (!code2FA) {
      errorNoti("Inserisci il Codice numerico che hai appena ricevuto");
    }

    if (!this.state.email) {
      errorNoti("Failed to Fetch User Email");
    }

    if (!this.state.id) {
      errorNoti("Failed to Fetch User ID");
    }

    this.props.login2FAVerify(
      code2FA,
      this.state.email,
      this.state.id,
      this.props.history
    );
  };

  validateEmail = (value) => {
    let error;
    if (!value) {
      error = "Inserisci la tua Email";
    } else if (!validateEmail(value)) {
      error = "Indirizzo Email Non Valido";
    }
    return error;
  };

  validatePassword = (value) => {
    let error;
    if (!value) {
      error = "Inserisci la tua Password";
    } else if (value.length < 4) {
      error = "La Password deve contenere almeno 4 caratteri";
    }
    return error;
  };

  componentDidUpdate() {
    if (this.props.error) {
      // NotificationManager.warning(
      //   this.props.error,
      //   "Login Error",
      //   3000,
      //   null,
      //   null,
      //   ''
      // );
    }
  }

  changeValue(type, e) {
    this.state[type] = e.target.value;
    this.setState(this.state);
  }

  change2FAValue(e) {
    let code2FA = e.target.value;
    this.setState({ code2FA });

    if (code2FA.length === 4) {
      this.verify2FA(code2FA);
    }
  }

  render() {
    const { password, email } = this.state;
    const initialValues = { email, password };

    return (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto he_oo">
          <Card className="auth-card">
            <div className="position-relative image-side ">
              <p className="text-white h1">
                <b>Benvenuto!</b>
                <hr />
                <br />
              </p>
              <h5 className="white mb-0">
                <b>
                  Usa le tue credenziali per effettuare il login.
                  <br />
                  Se non sei già registrato, clicca su:{" "}
                </b>
                <NavLink
                  to={"/" + URL_PREFIX + `/account/register`}
                  style={{
                    color: "gold",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  Registrati.
                </NavLink>
              </h5>
            </div>
            <div className="form-side">
              <NavLink to={"/" + URL_PREFIX + `/`} className="white">
                <span className="logo-single" />
              </NavLink>
              {!this.state.isAuthenticated && (
                <>
                  <CardTitle className="mb-4">
                    <IntlMessages id="user.login-title" />
                  </CardTitle>

                  <Formik
                    initialValues={initialValues}
                    onSubmit={this.onUserLogin}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleBlur,
                      handleChange,
                    }) => (
                      <Form className="av-tooltip tooltip-label-bottom">
                        <FormGroup className="form-group has-float-label">
                          <Label>
                            <IntlMessages id="user.email" />
                          </Label>
                          <Field
                            className="form-control"
                            id="loginEmailField"
                            name="email"
                            validate={this.validateEmail.bind(this, email)}
                            value={email}
                            onChange={
                              handleChange &&
                              this.changeValue.bind(this, "email")
                            }
                            onBlur={handleBlur}
                            placeholder="La tua email"
                          />
                          {errors.email && touched.email && (
                            <div className="invalid-feedback d-block">
                              {errors.email}
                            </div>
                          )}
                        </FormGroup>
                        <FormGroup className="form-group has-float-label">
                          <Label>
                            <IntlMessages id="user.password" />
                          </Label>
                          <Field
                            className="form-control"
                            type="password"
                            name="password"
                            value={password}
                            validate={this.validatePassword.bind(
                              this,
                              password
                            )}
                            onChange={
                              handleChange &&
                              this.changeValue.bind(this, "password")
                            }
                            onBlur={handleBlur}
                          />
                          {errors.password && touched.password && (
                            <div className="invalid-feedback d-block">
                              {errors.password}
                            </div>
                          )}
                        </FormGroup>
                        <div className="d-flex justify-content-between align-items-center">
                          <NavLink
                            to={`/` + URL_PREFIX + `/account/forgot-password`}
                          >
                            <IntlMessages id="user.forgot-password-question" />
                          </NavLink>
                          <Button
                            color="primary"
                            className={`btn-shadow btn-multiple-state ${
                              this.props.loading ? "show-spinner" : ""
                            }`}
                            size="lg"
                            type="submit"
                          >
                            <span className="spinner d-inline-block">
                              <span className="bounce1" />
                              <span className="bounce2" />
                              <span className="bounce3" />
                            </span>
                            <span className="label">
                              <IntlMessages id="user.login-button" />
                            </span>
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </>
              )}

              {this.state.isAuthenticated && (
                <>
                  <div className="d-flex justify-content-center align-items-center">
                    <CardTitle className="mb-4">
                      <IntlMessages id="user.login-2FA-title" />
                      <p>
                        Ti abbiamo appena inviato un "Codice 2FA di Verifica".
                        Controlla la tua email!
                      </p>
                    </CardTitle>
                  </div>
                  <div className="d-flex justify-content-center align-items-center">
                    {/*<div className='row'>*/}
                    <form>
                      <label htmlFor="2FAInputBox">
                        Inserisci il tuo Codice di Verifica (2FA):
                        <input
                          type="text"
                          className="form-control"
                          id="2FAInputBox"
                          style={{ fontSize: "25pt" }}
                          maxLength="4"
                          size="3"
                          onChange={this.change2FAValue.bind(this)}
                        />
                      </label>
                    </form>
                    {/*</div>*/}
                  </div>
                </>
              )}
            </div>
          </Card>
        </Colxx>
      </Row>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user, loading, error } = authUser;
  return { user, loading, error };
};

export default connect(mapStateToProps, {
  loginUser,
  login2FAVerify,
})(Login);
// export default withRouter(Login)
