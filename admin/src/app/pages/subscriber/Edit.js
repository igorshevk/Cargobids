import React, {Component} from "react"
import {Link, withRouter} from 'react-router-dom';
import {Button, Form, Col} from "react-bootstrap";
import Select from 'react-select';
import {BoxContainerBasic} from "../../partials/content/BoxContainer";
import {get, patch, PAYMENT_TYPES, YES_NO} from '../../crud/api';
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
import {URL_PREFIX} from "../../constants/defaultValues"

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
        const {subscriber_id} = this.props.match.params;

        this.state = {
            validated: false,
            errors:[], showError:false,
            selected_payment_type:{},
            selected_membership:{},
            selected_trial_avail:{},
            plans:{},
            subscriber:{},
            selected_period:{'label':'No','value':'No'}
        };

        this.getPlans(subscriber_id);
        this.getSubscriber = this.getSubscriber.bind(this);
    }

    getSubscriber = (subscriber_id) => {
        get('subscriptions/' + subscriber_id + '/')
            .then(
                (response) => {
                    PAYMENT_TYPES.map((payment_type) =>
                        payment_type.value === response.data.payment_type ? this.setState({selected_payment_type:payment_type}):''
                    );

                    this.state.plans.map(plan => 
                        response.data.membership.id !== undefined && plan.value === response.data.membership.id ? this.setState({selected_membership:plan}):''
                    );

                    response.data.membership = response.data.membership.id;
                    let user = response.data.user;
                    response.data.user = response.data.user.id;
                    if(user.trial == 1)
                        this.setState({selected_period:{'label':'Yes','value':'Yes'}})
                    else
                        this.setState({selected_period:{'label':'No','value':'No'}})

                    this.setState({subscriber:response.data, user:user});
                });
    };

    getPlans = (subscriber_id) => {
        get('plans')
            .then(  
                (response) => {
                    response.data.map((plan, i) => {
                        response.data[i].label = plan.name
                        response.data[i].value = plan.id;
                    })
                    this.setState({plans:response.data});
                    this.getSubscriber(subscriber_id);
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

        patch('subscriptions/' + this.state.subscriber.id + '/', this.state.subscriber)
            .then(res => {
                if (res.data) {
                    notify.success('Subscription successfully updated');
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
        const {subscriber, user, plans, selected_membership, selected_payment_type } = this.state;

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
                        beforeCodeTitle={"Edit Subscription"}
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
                                            value={user ? user.email:''}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            readonly={true}
                                            disabled={true}
                                            value={user ? user.firstname+' '+user.lastname:''}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Company</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            readonly={true}
                                            disabled={true}
                                            value={subscriber && subscriber.company ? subscriber.company:''}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Payment Type</Form.Label>
                                        <Select
                                            value={selected_payment_type}
                                            model="user"
                                            name="payment_type"
                                            onChange={(e) => this.selectChange(e, 'payment_type')}
                                            options={PAYMENT_TYPES}
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
                                            value={this.state.selected_period}
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
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Bank Transfer No.</Form.Label>
                                        <Form.Control
                                            required
                                            type="text" 
                                            name="bank_transfer_no"
                                            onChange={(e) => {this.handleChange(e)}}
                                            value={subscriber ? subscriber.bank_transfer_no:''}
                                        />
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