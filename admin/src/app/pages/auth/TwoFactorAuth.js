import React, { Component } from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import { TextField } from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../../store/ducks/auth.duck";
import { requestToken } from "../../crud/auth.crud";
import {URL_PREFIX} from '../../constants/defaultValues';

class TwoFactorAuth extends Component {
  state = { isTokenRequested: false };

  render() {
    const { intl } = this.props;
    const { user } = this.props.extra_data;

    const { email, id, isTokenRequested } = this.state;

    if (!user || !user.email || !user.id || isTokenRequested) {
      return <Redirect to={"/"+URL_PREFIX+"/auth"} />;
    }

    return (
        <div className="kt-grid__item kt-grid__item--fluid  kt-grid__item--order-tablet-and-mobile-1  kt-login__wrapper">
          <div className="kt-login__body">
            <div className="kt-login__form">
              <div className="kt-login__title">
                <h3>
                  <FormattedMessage id="AUTH.TWOFACTOR.TITLE" />
                </h3>
                <span>Please check your email for received verification code</span>
              </div>

              <Formik
                  initialValues={{ email: "" }}
                  validate={values => {
                    const errors = {};

                    if (!values.key) {
                      errors.key = intl.formatMessage({
                        id: "AUTH.VALIDATION.REQUIRED_FIELD"
                      });
                    }

                    return errors;
                  }}
                  onSubmit={(values, { setStatus, setSubmitting }) => {
                    requestToken(values.key, user.id, user.email)
                         .then(({ data: { token } }) => {
                          this.setState({ isTokenRequested: true });
                          this.props.login(token);
                          this.props.history.push('/admin/dashboard');
                        })
                        .catch(() => {
                          setSubmitting(false);
                          setStatus(
                              intl.formatMessage(
                                  { id: "AUTH.TWOFACTOR.CODE.ERROR" },
                                  { name: values.key }
                              )
                          );
                        });
                  }}
              >
                {({
                    values,
                    status,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting
                  }) => (
                    <form onSubmit={handleSubmit} className="kt-form">
                      {status && (
                          <div role="alert" className="alert alert-danger">
                            <div className="alert-text">{status}</div>
                          </div>
                      )}

                      <div className="form-group">
                        <TextField
                            type="text"
                            label="2FA Code Here"
                            margin="normal"
                            fullWidth={true}
                            name="key"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.key}
                            helperText={touched.key && errors.key}
                            error={Boolean(touched.key && errors.key)}
                        />
                      </div>

                      <div className="kt-login__actions">
                        <Link to={"/"+URL_PREFIX+"/auth"}>
                          <button
                              type="button"
                              className="btn btn-secondary btn-elevate kt-login__btn-secondary"
                          >
                            Back
                          </button>
                        </Link>

                        <button
                            type="submit"
                            className="btn btn-primary btn-elevate kt-login__btn-primary"
                            disabled={isSubmitting}
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
    );
  }
}

export default injectIntl(connect(null, auth.actions)(TwoFactorAuth));
