import React, {Component} from "react"
import {Link, withRouter} from 'react-router-dom';
import {Button, Form, Col} from "react-bootstrap";
import Select from 'react-select';
import {BoxContainerBasic} from "../../partials/content/BoxContainer";
import {get, post, PAYMENT_TYPES, YES_NO} from '../../crud/api';
import {getRoles,getDateWithFormat} from "../../helpers/commons";
import notify from "../../helpers/Notifications";
import {
    Checkbox,
} from "@material-ui/core";
import Notice from "../../partials/content/Notice";
import {ThemeProvider} from "@material-ui/styles";
import {MuiPickersUtilsProvider, DatePicker} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import {createMuiTheme} from "@material-ui/core";
import {getUserRoleFromGroupID, URL_PREFIX} from "../../constants/defaultValues"

const defaultMaterialTheme = createMuiTheme({
    props: {
        MuiInput: {
            disableUnderline: true,
        },
        MuiTextField: {
            style: {
                display: "block",
            },
        },
        MuiInputBase: {
            style: {
                display: "block",
            },
            disableUnderline: true,
            inputProps: {
                style: {
                    display: "block",
                    height: "calc(1.5em + 1.3rem + 2px)",
                    padding: "0.65rem 1rem",
                    fontSize: "1rem",
                    fontWeight: "400",
                    lineHeight: "1.5",
                    color: "#495057",
                    backgroundColor: "#fff",
                    backgroundClip: "padding-box",
                    border: "1px solid #e2e5ec",
                    borderRadius: "4px",
                    transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                    boxSizing: "border-box",
                }
            }
        },
    },
});

class SubscriberEdit extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        const {user_id} = this.props.match.params;

        this.state = {
            validated: false,
            errors:[], showError:false,
            selected_payment_type:{value: '', label : '--None--'},
            selected_membership:{},
            selected_trial_avail:{},
            user:{},
            plans:{},
            subscriber:{
                user: user_id, 
                payment_received_on:null, 
                invoice_sent_on:null, 
                current_period_start:null, 
                current_period_end:null, 
            }
        };

        this.getPlans(user_id);
        this.getUser = this.getUser.bind(this);
    }

    getUser = (user_id) => {
        get('users/' + user_id + '/')
            .then(
                (response) => {

                    let selected_trial_avail = {'label':'No','value':'No'};
                    if(response.data.user && response.data.user.trial === 1) 
                        selected_trial_avail = {'label':'Yes','value':'Yes'}

                    let userRole = getUserRoleFromGroupID(response.data.groups[0]);
                    if(userRole === 'Agent')
                        response.data.company = response.data.agent_company.agent_company_name;
                    else if(userRole === 'Airline')
                        response.data.company = response.data.airline_company.airline_company_name;
                    else
                        response.data.company = '';
                    console.log(response.data);
                    this.setState({user:response.data, selected_trial_avail:selected_trial_avail});
                });
    };

    getPlans = (user_id) => {
        get('plans')
            .then(
                (response) => {
                    let subscriber = this.state.subscriber;
                    let plans = response.data.filter((plan, i) => {
                        response.data[i].label = plan.name
                        response.data[i].value = plan.id;
                        if(plan.name == 'Trial') {
                            subscriber.membership = plan.id;
                            this.setState({selected_membership:plan, subscriber:subscriber});
                            return true;
                        } else return false;
                    })
                    this.setState({plans:plans});
                    this.getUser(user_id);
                });
    };

    handleChange(e, key=null) {
        let subscriber = this.state.subscriber;
        if(key === null)
            subscriber[e.target.name] = e.target.value;
        else
            subscriber[key] = e;
        this.setState({subscriber:subscriber});
    }

    handleSubmit = (e) => {
        let form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        post('subscriptions', this.state.subscriber)
            .then(res => {
                if (res.data) {
                    notify.success('Subscription successfully created');
                    this.props.history.push("/"+URL_PREFIX+"/subscribers");
                } else {
                    notify.error('Failed to update the records');
                }
            })
            .catch(error => {
                console.log(error);
                this.sendError(error.response.data);
            });
    };



    sendError(err, errors=[]) {
        if(Object.keys(err).length){
            for (let index in Object.keys(err)) {
                let innerErr = Object.keys(err)[index];
                if(Array.isArray(err[innerErr])) {
                    for (let i in err[innerErr]) {
                        if(typeof err[innerErr][i] === 'object')
                            return this.sendError(err[innerErr][i], errors);
                        errors.push(innerErr.charAt(0).toUpperCase() + innerErr.slice(1)+' : '+err[innerErr][i]);
                    }
                } else {
                    return this.sendError(err[innerErr], errors);
                }
            }
            this.setState({showError:true});
        }

        this.setState({errors:errors});
    }

    selectChange = (value, stateKey) => {
        let subscriber = this.state.subscriber;
        subscriber[stateKey] = value.value
        this.setState({subscriber: subscriber, ['selected_'+stateKey]:value});
    };

    render() {
        const {subscriber, plans, selected_membership, user, selected_payment_type, selected_trial_avail } = this.state;

        const buttons = <Link to={"/"+URL_PREFIX+"/subscribers"} className="btn btn-clean btn-icon-sm">
            <i className="la la-long-arrow-left"></i>
            Back
        </Link>;

        return (
            <>
            <Notice icon="flaticon-warning kt-font-primary" style={{display: this.state.showError ? 'flex' : 'none' }}>
            { 
                this.state.errors.map((val, i) => {
                        return <li key={i}>{val}</li>
                })
            }
            </Notice>
            <div className="row">
                <div className="col-md-12">
                    <BoxContainerBasic
                        beforeCodeTitle={"Add Subscription"}
                        afterTitleRight={buttons}
                    >
                        <div className="kt-section">
                            <Form
                                noValidate
                                onSubmit={e => this.handleSubmit(e)}
                            >
                                <Form.Row>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>User Email</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            readonly={true}
                                            disabled={true}
                                            value={user ? user.email:""}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            readonly={true}
                                            disabled={true}
                                            value={user ? user.firstname+' '+user.lastname : ''}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Company</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            readonly={true}
                                            disabled={true}
                                            value={user.company ? user.company:''}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Payment Type</Form.Label>
                                        <Select
                                            value={selected_payment_type}
                                            model="user"
                                            name="payment_type"
                                            onChange={(e) => this.selectChange(e, 'payment_type')}
                                            options={[selected_payment_type]}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Membership Plan</Form.Label>
                                        <Select
                                            value={selected_membership}
                                            model="user"
                                            name="membership"
                                            onChange={(e) => this.selectChange(e, 'membership')}
                                            options={plans}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Trial Period Availed</Form.Label>
                                        <Select
                                            value={selected_trial_avail}
                                            model="user"
                                            name="trial_avail"
                                            onChange={(e) => this.selectChange(e, 'trial_avail')}
                                            options={YES_NO}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Start Date</Form.Label>
                                        <ThemeProvider theme={defaultMaterialTheme}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <DatePicker
                                                    minDate={getDateWithFormat()}
                                                    value={subscriber.current_period_start}
                                                    format="dd-MM-yyyy"
                                                    onChange={e => this.handleChange(e, 'current_period_start')}
                                                    animateYearScrolling
                                                />
                                            </MuiPickersUtilsProvider>
                                        </ThemeProvider>
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>End Date</Form.Label>
                                        <ThemeProvider theme={defaultMaterialTheme}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <DatePicker
                                                    value={subscriber.current_period_end}
                                                    format="dd-MM-yyyy"
                                                    onChange={e => this.handleChange(e, 'current_period_end')}
                                                    animateYearScrolling
                                                />
                                            </MuiPickersUtilsProvider>
                                        </ThemeProvider>
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Payment Received On</Form.Label>
                                        <ThemeProvider theme={defaultMaterialTheme}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <DatePicker
                                                    value={subscriber.payment_received_on}
                                                    format="dd-MM-yyyy"
                                                    onChange={e => this.handleChange(e, 'payment_received_on')}
                                                    animateYearScrolling
                                                />
                                            </MuiPickersUtilsProvider>
                                        </ThemeProvider>
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Invoice Sent On</Form.Label>
                                        <ThemeProvider theme={defaultMaterialTheme}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <DatePicker
                                                    value={subscriber.invoice_sent_on}
                                                    format="dd-MM-yyyy"
                                                    onChange={e => this.handleChange(e, 'invoice_sent_on')}
                                                    animateYearScrolling
                                                />
                                            </MuiPickersUtilsProvider>
                                        </ThemeProvider>
                                    </Form.Group>
                                </Form.Row>

                                <div className='pull-right'>
                                    <Link to={"/"+URL_PREFIX+"/subscribers/list"} className="btn btn-danger">
                                        <i className="la la-remove"/>
                                        Cancel
                                    </Link>
                                    &nbsp;&nbsp;
                                    
                                    <Button type="submit" className="btn btn-primary" onClick={e=>this.setState({submitType:'update'})}>
                                        <i className="la la-save"/>
                                        Save
                                    </Button>

                                </div>
                            </Form>
                        </div>
                    </BoxContainerBasic>
                </div>
            </div>
            </>
        );
    }
}

export default withRouter(SubscriberEdit);