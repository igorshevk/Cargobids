import React, {Component} from "react";
import {Row, Card, Label, Input, Button, FormGroup, CardTitle} from "reactstrap";
import {NavLink} from "react-router-dom";

import {Colxx} from "../../components/common/CustomBootstrap";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from 'react-loader-spinner'
import {
    ACCOUNT_AGENT,
    ACCOUNT_AIRLINE,
} from '../../redux/actions';
import {connect} from "react-redux";
import queryString from 'query-string';
import {completeRegistrationRequest, verifyEmailAddress} from "../../redux/auth/actions";
import {successNoti, errorNoti} from "../../helpers/Notifications"
import {ucFirst} from '../../helpers/Utils';
import {Field, Formik, Form, withFormik} from "formik";
import IntlMessages from "../../helpers/IntlMessages";
import { URL_PREFIX } from "../../constants/defaultValues"

class RegisterDetails extends Component {
    constructor(props) {
        super(props);
        const {location} = this.props;
        const parsed = queryString.parse(location.search);
        this.state = {
            currentValues: {
                firstname: "",
                lastname: "",
                address:"",
                companyname:"",
                address2:"",
                city: "",
                branch :"",
                zip_code:""
            },
            keyVerified: false,
            verificationFailed: false,
            loading: true,
            qsData: parsed,
            user: {
                userType: null,
                email: null,
                id: null,
                userTypeID: null
            },
            isRegistrationCompleted:false
        };

        this.onUserRegisterComplete = this.onUserRegisterComplete.bind(this);
    }

    componentDidMount() {
        if (this.state.qsData.key && !this.state.keyVerified) {
            this.props.verifyEmailAddress(this.state.qsData.key, (err, res) => {
                if (err) {
                    let {response: {data}} = err;
                    if (data.error) {
                        errorNoti(data.error);
                    } else {
                        errorNoti('Verification Failed');
                    }

                    this.setState({
                        loading: false,
                        verificationFailed: true
                    });
                }

                if (res) {
                    let {Success, id, email, firstname, lastname, group_name, group_id} = res;
                    successNoti(Success);
                    this.setState({
                        loading: false,
                        keyVerified: true,
                        user: {
                            userType: group_name.toLowerCase(),
                            userTypeID: group_id,
                            email,
                            firstname,
                            lastname,
                            id,
                        }
                    });
                }
            });
        }
    }

    handleChangeChk() {
        this.setState({isChecked: !this.state.isChecked})
    }

    onUserRegisterComplete = (values) => {
        if (!this.state.loading) {
            let {email, userType} = values;
            this.setState({loading:true});
            let userDetails = {
                ...this.state.currentValues,
                userID: this.state.user.id,
                activationKey: this.state.qsData.key
            };

            this.props.completeRegistrationRequest(userDetails, (err, res) => {
                if (err) {
                    this.setState({loading:false});
                }
                if (res) {
                    let {Success} = res;
                    //this.state.isRegistered = true; //Update the State.
                    this.setState({isRegistrationCompleted: true});
                    // successNoti(Success);
                }
            });
        }
    };

    handleChangeDate(date, e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            startDate: date
        });
    };

    warningDisplay(message) {
        // toast(message, { type: toast.TYPE.ERROR });
    }

    successDisplay(message) {
        // toast(message, { type: toast.TYPE.SUCCESS });
    }

    verification() {

    }

    changeValue(type, e) {
        this.state.currentValues[type] = e.target.value;
        this.setState({currentValues:this.state.currentValues})
    }

    handleChange = (type,e) => {
        console.log('type', type);
        console.log('e', e);
    };

    render() {
        // let {step}=this.state
        // const {loading,nextloading, steps, step,currentValues,isChecked,preview,preview_front,preview_back} = this.state;
        const {user: {email,firstname, lastname, userType}, 
            currentValues: {
                companyname, branch, address, address2, city, zip_code, cf, pec, p_iva, iata, sdi
            }
        } = this.state;
        const initialValues = {email, userType, firstname, lastname, address, address2, city, zip_code};
        return (
            <Row className="h-100 register">
                <Colxx xxs="12" md="10" className="mx-auto my-auto">
                    <Card className="auth-card">
                        <NavLink to={'/'+URL_PREFIX+`/account/login`} style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: '#fe5619',
                            position: 'absolute',
                            right: '20px',
                            top: '20px'
                        }}>
                            Vai alla pagina di Login!
                        </NavLink>
                        {!this.state.isRegistrationCompleted && <>
                            <div className="form-side">
                                {!this.state.keyVerified && this.state.loading &&
                                <div style={{textAlign: "center"}}>
                                    <h3>Ti preghiamo di attendere mentre verifichiamo il tuo indirizzo Email.</h3>
                                    <div>
                                        <Loader
                                            type="Oval"
                                            color="#00BFFF"
                                            height={100}
                                            width={100}
                                        />
                                    </div>

                                </div>
                                }

                                {/*If only verification is failed for key*/}
                                {!this.state.keyVerified && !this.state.loading && this.state.verificationFailed &&
                                <div style={{textAlign: "center"}}>
                                    <h3 style={{color: "red"}}>!!! Verifica non riuscita !!!</h3>
                                    <p>Verifica fallita per la chiave inserita</p>                                </div>
                                }


                                {this.state.keyVerified &&
                                <div>
                                    <div style={{textAlign: 'center'}}>
                                        <h1>Benvenuto!</h1>
                                        <p>Ti preghiamo compilare il seguente form per completare la procedura di registrazione:<span
                                            className="mb-1 badge badge-secondary"> {ucFirst(this.state.user.userType)} </span>
                                        </p>
                                    </div>
                                    <Formik
                                        initialValues={initialValues}
                                        onSubmit={this.onUserRegisterComplete}
                                    >{
                                        ({
                                             values,
                                             errors,
                                             touched,
                                             handleBlur,
                                             handleChange
                                         }) => (
                                            <Form className="detail-registration-form">
                                                <div className="mb-4">
                                                    <h3 className="text-center">User Details</h3>
                                                </div>
                                                {/*Email*/}
                                                <FormGroup className="form-group col-md-4 ">
                                                    <Label className="form-group has-float-label mb-4">
                                                        <IntlMessages id="user.email"/>
                                                    </Label>
                                                    <Field
                                                        className="form-control"
                                                        readOnly={true}
                                                        value={email}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange && this.changeValue.bind(this,'firstname')}
                                                    />
                                                </FormGroup>
                                                {/*First Name*/}
                                                <FormGroup className="form-group col-md-4">
                                                    <Label className="form-group has-float-label mb-4">
                                                        <IntlMessages id="user.firstname"/>
                                                    </Label>
                                                    <Field
                                                        className="form-control"
                                                        readOnly={true}
                                                        value={firstname}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange && this.changeValue.bind(this,'firstname')}
                                                    />
                                                </FormGroup>
                                                {/*Last Name*/}
                                                <FormGroup className="form-group col-md-4">
                                                    <Label className="form-group has-float-label mb-4">
                                                        <IntlMessages id="user.lastname"/>
                                                    </Label>
                                                    <Field
                                                        className="form-control"
                                                        value={lastname}
                                                        readOnly={true}
                                                        onBlur={handleBlur}
                                                        onChange={this.changeValue.bind(this,'lastname')}
                                                    />
                                                </FormGroup>
                                                <div className="mb-4 mt-2">
                                                    <h3 className="text-center">Company Invoice Details</h3>
                                                </div>
                                                {/*Company Name*/}
                                                <FormGroup className="form-group col-md-4">
                                                    <Label className="form-group has-float-label mb-4">
                                                        <IntlMessages id="user.companyname"/>
                                                    </Label>
                                                    <Field
                                                        className="form-control"
                                                        name="companyname"
                                                        value={companyname}
                                                        onBlur={handleBlur}
                                                        onChange={this.changeValue.bind(this,'companyname')}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="form-group col-md-4">
                                                    <Label className="form-group has-float-label mb-4">
                                                        <IntlMessages id="user.branch"/>
                                                    </Label>
                                                    <Field
                                                        className="form-control"
                                                        name="branch"
                                                        value={branch}
                                                        onBlur={handleBlur}
                                                        onChange={this.changeValue.bind(this,'branch')}
                                                    />
                                                </FormGroup>
                                                {/*Address 1*/}
                                                <FormGroup className="form-group col-md-4">
                                                    <Label className="form-group has-float-label mb-4">
                                                        <IntlMessages id="user.address1"/>
                                                    </Label>
                                                    <Field
                                                        className="form-control"
                                                        name="address"
                                                        value={address}
                                                        onBlur={handleBlur}
                                                        onChange={this.changeValue.bind(this,'address')}
                                                    />
                                                </FormGroup>
                                                {/*Address 2*/}
                                                <FormGroup className="form-group col-md-4">
                                                    <Label className="form-group has-float-label mb-4">
                                                        <IntlMessages id="user.address2"/>
                                                    </Label>
                                                    <Field
                                                        className="form-control"
                                                        name="address2"
                                                        value={address2}
                                                        onBlur={handleBlur}
                                                        onChange={this.changeValue.bind(this,'address2')}
                                                    />
                                                </FormGroup>
                                                {/*Zip Code*/}
                                                <FormGroup className="form-group col-md-4">
                                                    <Label className="form-group has-float-label mb-4">
                                                        <IntlMessages id="user.zip"/>
                                                    </Label>
                                                    <Field
                                                        className="form-control"
                                                        maxlength={5}
                                                        name="zip_code"
                                                        value={zip_code}
                                                        onBlur={handleBlur}
                                                        onChange={this.changeValue.bind(this,'zip_code')}
                                                    />
                                                </FormGroup>
                                                {/*City*/}
                                                <FormGroup className="form-group col-md-4">
                                                    <Label className="form-group has-float-label mb-4">
                                                        <IntlMessages id="user.city"/>
                                                    </Label>
                                                    <Field
                                                        className="form-control"
                                                        name="city"
                                                        value={city}
                                                        onBlur={handleBlur}
                                                        onChange={this.changeValue.bind(this,'city')}
                                                        // placeholder="demo@gmail.com"
                                                    />
                                                </FormGroup>
                                                {userType == 'agent' ? 
                                                <FormGroup className="form-group col-md-4">
                                                    <Label className="form-group has-float-label mb-4">
                                                        <IntlMessages id="user.iata"/>
                                                    </Label>
                                                    <Field
                                                        className="form-control"
                                                        name="iata"
                                                        value={iata}
                                                        onBlur={handleBlur}
                                                        maxLength={11}
                                                        onChange={this.changeValue.bind(this,'iata')}
                                                    />
                                                </FormGroup> : ''}
                                                <FormGroup className="form-group col-md-4">
                                                    <Label className="form-group has-float-label mb-4">
                                                        <IntlMessages id="user.cf"/>
                                                    </Label>
                                                    <Field
                                                        className="form-control"
                                                        name="cf"
                                                        value={cf}
                                                        onBlur={handleBlur}
                                                        onChange={this.changeValue.bind(this,'cf')}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="form-group col-md-4">
                                                    <Label className="form-group has-float-label mb-4">
                                                        <IntlMessages id="user.pec"/>
                                                    </Label>
                                                    <Field
                                                        className="form-control"
                                                        name="pec"
                                                        value={pec}
                                                        onBlur={handleBlur}
                                                        onChange={this.changeValue.bind(this,'pec')}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="form-group col-md-4">
                                                    <Label className="form-group has-float-label mb-4">
                                                        <IntlMessages id="user.sdi"/>
                                                    </Label>
                                                    <Field
                                                        className="form-control"
                                                        name="sdi"
                                                        value={sdi}
                                                        onBlur={handleBlur}
                                                        maxLength={7}
                                                        minLength={7}
                                                        onChange={this.changeValue.bind(this,'sdi')}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="form-group col-md-4">
                                                    <Label className="form-group has-float-label mb-4">
                                                        <IntlMessages id="user.p_iva"/>
                                                    </Label>
                                                    <Field
                                                        className="form-control"
                                                        name="p_iva"
                                                        value={p_iva}
                                                        onBlur={handleBlur}
                                                        onChange={this.changeValue.bind(this,'p_iva')}
                                                    />
                                                </FormGroup>
                                                <div className="d-flex justify-content-end align-items-center">
                                                    <Button
                                                        color="primary"
                                                        className={`btn-shadow btn-multiple-state btn-lg ${this.props.loading ? "show-spinner" : ""}`}
                                                        size="lg"
                                                        type="submit"
                                                    >
                                                    <span className="label"><IntlMessages
                                                        id="pages.submit"/></span>
                                                    </Button>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                                }

                            </div>
                        </>}

                        {this.state.isRegistrationCompleted &&
                            <div className="d-flex flex-column">
                                <CardTitle className="mb-1 mt-4">
                                    {/*<IntlMessages id="user.register"/>*/}
                                    <h1>Grazie!</h1>
                                </CardTitle>
                                <div className="mb-3">
                                    <p>
                                        La tua richiesta di registrazione verrá presa in carico e riceverai a breve una conferma.
                                    </p>
                                </div>
                            </div>
                        }

                    </Card>
                </Colxx>
            </Row>
        );
    }
}

// export default RegisterDetails
const mapStateToProps = ({authUser}) => {
    const {user, loading} = authUser;
    return {user, loading};
};

export default connect(
    mapStateToProps,
    {
        verifyEmailAddress,
        completeRegistrationRequest
    }
)(RegisterDetails);
