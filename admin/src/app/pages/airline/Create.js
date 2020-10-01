import React, {Component} from "react"
import {Link, withRouter} from 'react-router-dom';
import {Button, Form, Col} from "react-bootstrap";
import Select from 'react-select';
import {BoxContainerBasic} from "../../partials/content/BoxContainer";
import {get, post, AIRLINE_MODES, loadOptions} from '../../crud/api';
import {getRoles,getAirlines,capitalizeFirstLetter} from "../../helpers/commons";
import notify from "../../helpers/Notifications";
import {
    Checkbox,
} from "@material-ui/core";
import Notice from "../../partials/content/Notice";
import AsyncPaginate from "react-select-async-paginate";
import {URL_PREFIX} from "../../constants/defaultValues"

class AirlineEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validated: false,
            errors:[], showError:false,
            airline:{},
            selected_airline_mode:{},
            companies:[],
            selected_airline_company_name:{},
            modelsLoaded: false
        };

        this.captilizedFields = ['airline_company_name', 'branch','zip_code']

        this.getCompanies();
    }

    getCompanies = () => {
        get('companies')
            .then(
                (response) => {
                    let companies = response.data.map((company) => {
                        company.label = company.name;
                        company.value = company.name;
                        return company;
                    });
                    this.setState({companies:companies, modelsLoaded:true})
                });
    };

    handleChange(e) {
        let airline = this.state.airline;
        if(this.captilizedFields.indexOf(e.target.name) > -1)
            airline[e.target.name] = capitalizeFirstLetter(e.target.value);
        else
            airline[e.target.name] = e.target.value;

        this.setState({airline:airline});
    }

    selectChange = (value, stateKey, stateUserKey = null) => {
        let {airline} = this.state;
        if (stateUserKey) {
            airline[stateUserKey] = value.value;
        }
        this.setState({[stateKey]: value, airline});
    };

    handleSubmit = (e) => {
        let form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        let sdiLen = 0
        if(this.state.airline.hasOwnProperty('sdi'))
            sdiLen = this.state.airline.sdi.length;

        if(sdiLen !== 7) {
            notify.error('Sdi should be 7 characters long');
            return false;
        }
        post('airlines', this.state.airline)
            .then(res => {
                if (res.data) {
                    notify.success('Airline record successfully updated');
                    this.props.history.push("/"+URL_PREFIX+"/airlines");
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

    render() {
        const {airline, selected_airline_mode, companies, selected_airline_company_name, modelsLoaded, initialOptions } = this.state;

        const buttons = <Link to={"/"+URL_PREFIX+"/airlines"} className="btn btn-clean btn-icon-sm">
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
                        beforeCodeTitle={'Add Airline'}
                        afterTitleRight={buttons}
                    >
                        <div className="kt-section">
                            <Form
                                noValidate
                                onSubmit={e => this.handleSubmit(e)}
                            >
                                <Form.Row>
                                    <div className="col-12">
                                        <h5>Basic Information</h5>
                                        <hr/>
                                    </div>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            name="airline_company_name"
                                            value={airline.airline_company_name || ''}
                                            onChange={e => this.handleChange(e)}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Mode</Form.Label>
                                        <Select
                                            value={selected_airline_mode}
                                            name="airline_mode"
                                            onChange={(e) => this.selectChange(e, 'selected_airline_mode', 'mode')}
                                            options={AIRLINE_MODES}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Branch</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            name="branch"
                                            value={airline.branch || ''}
                                            onChange={e => this.handleChange(e)}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Cf</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            name="cf"
                                            value={airline.cf || ''}
                                            onChange={e => this.handleChange(e)}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Pec</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            name="pec"
                                            value={airline.pec || ''}
                                            onChange={e => this.handleChange(e)}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Sdi</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            name="sdi"
                                            value={airline.sdi || ''}
                                            maxLength={7}
                                            onChange={e => this.handleChange(e)}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Partita Iva</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            name="p_iva"
                                            value={airline.p_iva || ''}
                                            onChange={e => this.handleChange(e)}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} xs="12">
                                        <Form.Label>Active</Form.Label>
                                        <Checkbox name="is_active" checked={airline.is_active ? true : false}
                                            onChange={(e) => this.handleChange(e)} value="1"/>
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row>
                                    <div className="col-12">
                                        <h5>Address Information</h5>
                                        <hr/>
                                    </div>
                                </Form.Row>

                                <Form.Row>
                                    <Form.Group as={Col} md="3" xs="12">
                                        <Form.Label>Address 1</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            placeholder=""
                                            name="address_1"
                                            value={airline.address_1 || ''}
                                            onChange={e => this.handleChange(e)}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="3" xs="12">
                                        <Form.Label>Address 2</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            name="address_2"
                                            value={airline.address_2 || ''}
                                            onChange={e => this.handleChange(e)}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="3" xs="12">
                                        <Form.Label>Zip Code</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            name="zip_code"
                                            value={airline.zip_code || ''}
                                            onChange={e => this.handleChange(e)}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="3" xs="12">
                                        <Form.Label>City</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            placeholder=""
                                            name="city"
                                            value={airline.city || ''}
                                            onChange={e => this.handleChange(e)}
                                        />
                                    </Form.Group>
                                </Form.Row>

                                <div className='pull-right'>
                                    <Link to={"/"+URL_PREFIX+"/airlines/list"} className="btn btn-danger">
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

export default withRouter(AirlineEdit);