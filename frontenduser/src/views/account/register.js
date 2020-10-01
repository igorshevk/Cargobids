import React, { Component } from "react";
import {
  Row,
  Card,
  CardTitle,
  Label,
  Input,
  Button,
  FormGroup,
  CustomInput,
} from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../../redux/actions";

import IntlMessages from "../../helpers/IntlMessages";
import { Colxx } from "../../components/common/CustomBootstrap";
import { validateEmail } from "../../helpers/Utils";
import { Field, Formik, Form } from "formik";
import { successNoti, errorNoti } from "../../helpers/Notifications";
import { URL_PREFIX } from "../../constants/defaultValues";

const cStyle = `
    .radioFix {
        display: inline;
        padding-top: 4px;
    }
`;

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      userType: null,
      isRegistered: false,
    };

    this.onUserRegister = this.onUserRegister.bind(this);
  }

  onUserRegister = (values) => {
    let { email, password, userType, firstname, lastname } = values;

    if (!this.props.loading) {
      if (!email || !password) {
        //If anyone of it is missing. Do not submit Form.
        errorNoti("Please provide missing credentials.");
        return false;
      }

      if (!userType) {
        //If User Type is missing.
        errorNoti("Identifica la tua attivita'(Agente o Vettore.");
        return false;
      }

      if (!firstname) {
        //If User Type is missing.
        errorNoti("Inserisci la tua first name");
        return false;
      }

      if (!lastname) {
        //If User Type is missing.
        errorNoti("Inserisci la tua last name");
        return false;
      }

      this.props.registerUser(values, this.props.history, (err, res) => {
        if (err) {
          if (err.response) {
            let { data, status } = err.response;
            errorNoti(data.error);
          }
        }
        if (res) {
          let { Success } = res;
          //this.state.isRegistered = true; //Update the State.
          this.setState({ isRegistered: true });
          successNoti(Success);
        }
      });
    }
  };

  validEmail = (value) => {
    if (!value) {
      return "Inserisci il tuo indirizzo email";
    } else {
      let response = validateEmail(value);
      if (!response) {
        return "Indirizzo Email non corretto";
      }
    }
  };

  validatePassword = (value) => {
    let error;
    if (!value) {
      error = "Inserisci la tua password";
    } else if (value.length < 4) {
      error = "La password deve contenere almeno 5 caratteri";
    }
    return error;
  };

  validFirstname = (value) => {
    let error;
    if (!value) error = "Inserisci la tua first name";
    return error;
  };

  validLastname = (value) => {
    let error;
    if (!value) error = "Inserisci la tua last name";

    return error;
  };

  render() {
    const { password, email, userType } = this.state;
    const initialValues = { email, password, userType };
    return (
      <Row className="h-100">
        <style>{cStyle}</style>
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="position-relative image-side ">
              <p className="text-white h1">
                <b>Benvenuto!</b>
                <hr />
                <br />
                <br />
              </p>
              <h5 className="white mb-0">
                <b>
                  Utilizza questo form per richiedere la registrazione a
                  CargoBids. <br />
                  Se sei già registrato, clicca su:{" "}
                </b>
                <NavLink
                  to={"/" + URL_PREFIX + `/account/login`}
                  style={{
                    color: "gold",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  Login
                </NavLink>
                .
              </h5>
              <hr />
              <h4
                style={{
                  color: "white",
                  fontSize: "13px",
                }}
              >
                Nota: Non sono ammessi indirizzi email generici non nominativi{" "}
                <br />
                (es. info, export, sales ecc) o con dominio non riconducibile
                all'azienda titolare (es gmail, libero ecc).
              </h4>
            </div>
            <div className="form-side">
              <NavLink to={"/" + URL_PREFIX + `/`} className="white">
                <span className="logo-single" />
              </NavLink>
              {!this.state.isRegistered && (
                <>
                  <CardTitle className="mb-4">
                    <IntlMessages id="user.register" />
                  </CardTitle>
                  <Formik
                    initialValues={initialValues}
                    onSubmit={this.onUserRegister}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleBlur,
                      handleChange,
                    }) => (
                      <Form>
                        <FormGroup className="form-group has-float-label">
                          <Label>
                            <IntlMessages id="user.firstname" />
                          </Label>
                          <Field
                            className="form-control"
                            name="firstname"
                            validate={this.validFirstname}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="demo@gmail.com"
                          />
                          {errors.firstname && touched.firstname && (
                            <div className="invalid-feedback d-block">
                              {errors.firstname}
                            </div>
                          )}
                        </FormGroup>
                        <FormGroup className="form-group has-float-label">
                          <Label>
                            <IntlMessages id="user.lastname" />
                          </Label>
                          <Field
                            className="form-control"
                            name="lastname"
                            validate={this.validLastname}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="demo@gmail.com"
                          />
                          {errors.lastname && touched.lastname && (
                            <div className="invalid-feedback d-block">
                              {errors.lastname}
                            </div>
                          )}
                        </FormGroup>
                        <FormGroup className="form-group has-float-label">
                          <Label>
                            <IntlMessages id="user.email" />
                          </Label>
                          <Field
                            className="form-control"
                            name="email"
                            validate={this.validEmail}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="demo@gmail.com"
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
                            validate={this.validatePassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.password && touched.password && (
                            <div className="invalid-feedback d-block">
                              {errors.password}
                            </div>
                          )}
                        </FormGroup>

                        <div className="d-flex justify-content-center align-items-center">
                          {/*Register As*/}
                          <Label
                            style={{ display: "block" }}
                            color="primary"
                            className="btn btn-sm btn-primary btn-shadow mr-2"
                            size="md"
                          >
                            <Field
                              type="radio"
                              name="userType"
                              value="agent"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              style={{ display: "inline", paddingTop: "4px" }}
                            />
                            <b>AGENTE IATA</b>
                          </Label>
                          <Label
                            style={{ display: "block" }}
                            color="primary"
                            className="btn btn-sm btn-primary btn-shadow mr-2"
                            size="md"
                          >
                            <Field
                              type="radio"
                              name="userType"
                              value="airline"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              style={{ display: "inline", paddingTop: "4px" }}
                            />{" "}
                            <b>AIRLINE/GSA</b>
                          </Label>
                        </div>

                        <div
                          className="d-flex justify-content-end align-items-center"
                          style={{ marginTop: 20 }}
                        >
                          <Button
                            color="primary"
                            className={`btn-shadow btn-multiple-state btn-lg ${
                              this.props.loading ? "show-spinner" : ""
                            }`}
                            size="lg"
                            type="submit"
                            // onClick={() => this.onUserRegister()}
                          >
                            <IntlMessages id="user.register-button" />
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </>
              )}
              {this.state.isRegistered && (
                <>
                  <CardTitle className="mb-4">
                    {/*<IntlMessages id="user.register"/>*/}
                    <h3>Grazie per esserti registrato!</h3>
                  </CardTitle>
                  <p>
                    Ti abbiamo inviato una email all'indirizzo che hai
                    comunicato. Segui le istruzioni per completare la tua
                    Richiesta di Registrazione.
                  </p>
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
  const { user, loading } = authUser;
  return { user, loading };
};

export default connect(mapStateToProps, {
  registerUser,
})(Register);
