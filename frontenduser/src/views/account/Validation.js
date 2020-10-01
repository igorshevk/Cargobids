import React, { Component } from "react";
import { Card, CardBody, FormGroup, Label, Spinner,Button } from "reactstrap";
import IntlMessages from "../../helpers/IntlMessages";
import { Wizard, Steps, Step } from 'react-albus';
import { injectIntl } from 'react-intl';
import { BottomNavigation } from "../../components/wizard/BottomNavigation";
import { TopNavigation } from "../../components/wizard/TopNavigation";
import { Formik, Form, Field } from "formik";
import { NavLink,withRouter } from "react-router-dom";
import { URL_PREFIX } from '../../constants/defaultValues';

class Validation extends Component {
    constructor(props) {
        super(props);
        this.onClickNext = this.onClickNext.bind(this);
        this.onClickPrev = this.onClickPrev.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.validateFirstName = this.validateFirstName.bind(this);
        this.validateAddress = this.validateAddress.bind(this);
        this.validateLastName = this.validateLastName.bind(this);
        this.validateUsername = this.validateUserName.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        this.validateBirthday = this.validateBirthday.bind(this);

        this.form0 = React.createRef();
        this.form1 = React.createRef();
        this.form2 = React.createRef();

        this.state = {
            bottomNavHidden: false,
            topNavDisabled: false,
            loading: false,
            fields: [
                {
                    valid: false,
                    name: "firstname",
                    value: ""
                },
                {
                    valid: false,
                    name: "lastname",
                    value: ""
                },
                {
                    valid: false,
                    name: "birthday",
                    value: ""
                },
                {
                    valid: false,
                    name: "address",
                    value: ""
                },
                {
                    valid: false,
                    name: "city",
                    value: ""
                },
                {
                    valid: false,
                    name: "state",
                    value: ""
                },
                {
                    valid: false,
                    name: "zipcode",
                    value: ""
                },
                {
                    valid: false,
                    name: "mobilenumber",
                    value: ""
                },
                {
                    valid: false,
                    name: "emailaddress",
                    value: ""
                },
                {
                    valid: false,
                    name: "username",
                    value: ""
                },
                {
                    valid: false,
                    name: "password",
                    value: ""
                },
                {
                    valid: false,
                    name: "referralcode",
                    value: ""
                }
            ]
        }
    }

    componentDidMount() {
        this.setState({ fields: [{ ...this.state.fields[0], form: this.form0 }, { ...this.state.fields[1], form: this.form1 }, { ...this.state.fields[2], form: this.form2 }] });
    }

    validateEmail(value) {
        let error;
        if (!value) {
            error = "Please enter your email address";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
            error = "Invalid email address";
        }
        return error;
    }

    validateUserName(value) {
        let error;
        if (!value) {
            error = "Please enter your name";
        } else if (value.length < 2) {
            error = "Value must be longer than 2 characters";
        }
        return error;
    }

    validateFirstName(value) {
        let error;
        if (!value) {
            error = "Please enter your first name";
        } else if (value.length < 2) {
            error = "Value must be longer than 2 characters";
        }
        return error;
    }
    validateLastName(value) {
        let error;
        if (!value) {
            error = "Please enter your last name";
        } else if (value.length < 2) {
            error = "Value must be longer than 2 characters";
        }
        return error;
    }

    validateBirthday(value) {
        let error;
        if (!value) {
            error = "Please enter your birthday";
        } else if (value.length < 2) {
            error = "Value must be longer than 2 characters";
        }
        return error;
    }
    validateAddress(value) {
        let error;
        if (!value) {
            error = "Please enter your address";
        } else if (value.length < 2) {
            error = "Value must be longer than 2 characters";
        }
        return error;
    }
    validateCity(value) {
        let error;
        if (!value) {
            error = "Please enter your city";
        } else if (value.length < 2) {
            error = "Value must be longer than 2 characters";
        }
        return error;
    }
    validateState(value) {
        let error;
        if (!value) {
            error = "Please enter your state";
        } else if (value.length < 2) {
            error = "Value must be longer than 2 characters";
        }
        return error;
    }
    validateZipcode(value) {
        let error;
        if (!value) {
            error = "Please enter your zipcode";
        } else if (value.length < 2) {
            error = "Value must be longer than 2 characters";
        }
        return error;
    }
    validateMobileNumber(value) {
        let error;
        if (!value) {
            error = "Please enter your mobile number";
        } else if (value.length < 2) {
            error = "Value must be longer than 2 characters";
        }
        return error;
    }
    validatePassword(value) {
        let error;
        if (!value) {
            error = "Please enter your password";
        } else if (value.length < 6) {
            error = "Password must be longer than 6 characters";
        }
        return error;
    }

    hideNavigation() {
        this.setState({ bottomNavHidden: true, topNavDisabled: true });
    }

    asyncLoading () {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false });
        }, 3000);
    }

    onClickNext(goToNext, steps, step) {
        if (steps.length - 1 <= steps.indexOf(step)) {
            return;
        }
        let formIndex = steps.indexOf(step);
        let form = this.state.fields[formIndex].form.current;
        let name = this.state.fields[formIndex].name;
        console.log('name on onClickNest==',form.state.values[name])
        form.submitForm().then(() => {
            let fields = this.state.fields;
            fields[formIndex].value = form.state.values[name];
            fields[formIndex].valid = form.state.errors[name] ? false : true;
            this.setState({ fields });
            if (!form.state.errors[name]) {
                goToNext();
                step.isDone = true;
                if (steps.length - 2 <= steps.indexOf(step)) {
                    this.hideNavigation();
                    this.asyncLoading();
                }
            }
        });
    }

    onClickPrev(goToPrev, steps, step) {
        if (steps.indexOf(step) <= 0) {
            return;
        }
        goToPrev();
    }
    
  onUserLogin = (values) => {
    if (!this.props.loading) {
      if (values.email !== "" && values.password !== "") {
        // this.props.loginUser(values, this.props.history);
      }
    }
  }

  validateEmail = (value) => {
    let error;
    if (!value) {
      error = "Please enter your email address";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "Invalid email address";
    }
    return error;
  }

  validatePassword = (value) => {
    let error;
    if (!value) {
      error = "Please enter your name";
    } else if (value.length < 4) {
      error = "Value must be longer than 2 characters";
    }
    return error;
  }
    render() {
        const { messages } = this.props.intl;
        const { password, email } = this.state;
        const initialValues = {email,password};
        return (
            <Card>
                <CardBody className="wizard wizard-default ">
                <Formik
                    initialValues={initialValues}
                    onSubmit={this.onUserLogin}>
                    {({ errors, touched }) => (
                    <Form className="av-tooltip tooltip-label-bottom">
                        <FormGroup className="form-group has-float-label">
                        <Label>
                            <IntlMessages id="user.email" />
                        </Label>
                        <Field
                            className="form-control"
                            name="email"
                            validate={this.validateEmail}
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
                        />
                        {errors.password && touched.password && (
                            <div className="invalid-feedback d-block">
                            {errors.password}
                            </div>
                        )}
                        </FormGroup>
                        <div className="d-flex justify-content-between align-items-center">
                        <NavLink to={'/'+URL_PREFIX+`/forgot-password`}>
                            <IntlMessages id="user.forgot-password-question" />
                        </NavLink>
                        <Button
                            color="primary"
                            className={`btn-shadow btn-multiple-state btn btn-lg ${this.props.loading ? "show-spinner" : ""}`}
                            size="lg"
                            onClick={()=>{this.login()}}
                        >
                            <span className="spinner d-inline-block">
                            <span className="bounce1" />
                            <span className="bounce2" />
                            <span className="bounce3" />
                            </span>
                            <span className="label"><IntlMessages id="user.login-button" /></span>
                        </Button>
                        </div>


                    </Form>
                    )}
                </Formik>
                </CardBody>
            </Card>
        );
    }
}
export default injectIntl(Validation)
