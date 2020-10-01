import React, {Component} from "react"
import {Link, withRouter} from 'react-router-dom';
import {Button, Form, Col} from "react-bootstrap";
import Select from 'react-select';
import {BoxContainerBasic} from "../../partials/content/BoxContainer";
import {get, patch, loadOptions} from '../../crud/api';
import {getRoles,getAgents,capitalizeFirstLetter} from "../../helpers/commons";
import notify from "../../helpers/Notifications";
import {
    Checkbox,
} from "@material-ui/core";
import Notice from "../../partials/content/Notice";
import AsyncPaginate from "react-select-async-paginate";
import {URL_PREFIX} from "../../constants/defaultValues"

class AgentEdit extends Component {
    constructor(props) {
        super(props);
        const {params: {agent_id}} = this.props.match;

        this.state = {
            validated: false,
            errors:[], showError:false,
            agent:{},
            companies:[],
            selected_agent_company_name:{},
            modelsLoaded: false
        };

        this.getAgent(agent_id);
        
        this.captilizedFields = ['agent_company_name', 'branch','zip_code']
    }

    getCompanies = () => {
        get('companies')
            .then(
                (response) => {
                    let agent = this.state.agent;
                    let companies = response.data.map((company) => {
                        company.label = company.name;
                        company.value = company.name;

                        if(company.name.trim() == agent.agent_company_name.trim())
                            this.setState({selected_agent_company_name:company})

                        return company;
                    });
                    this.setState({companies:companies, modelsLoaded:true})
                });
    };

    getAgent = (agent_id) => {
        get('agents/' + agent_id + '/')
            .then(
                (response) => {
                    this.setState({agent:response.data})
                    this.getCompanies();
                });
    };

    handleChange(e) {
        let agent = this.state.agent;
        if(this.captilizedFields.indexOf(e.target.name) > -1)
            agent[e.target.name] = capitalizeFirstLetter(e.target.value);
        else
            agent[e.target.name] = e.target.value;
        this.setState({agent:agent});
    }

    selectChange = (value, stateKey) => {
        console.log(value);
        let agent = this.state.agent;
        agent[stateKey] = value.value
        this.setState({agent:agent, ['selected_'+stateKey]:value});
    };

    handleSubmit = (e) => {
        let form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        let sdiLen = 0
        if(this.state.agent.hasOwnProperty('sdi'))
            sdiLen = this.state.agent.sdi.length;

        if(sdiLen !== 7) {
            notify.error('Sdi should be 7 characters long');
            return false;
        }
        patch('agents/' + this.state.agent.id + '/', this.state.agent)
            .then(res => {
                if (res.data) {
                    notify.success('Agent record successfully updated');
                    this.props.history.push("/"+URL_PREFIX+"/agents");
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
        const {agent, companies, selected_agent_company_name, modelsLoaded, initialOptions } = this.state;

        const buttons = <Link to={"/"+URL_PREFIX+"/agents"} className="btn btn-clean btn-icon-sm">
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
                        beforeCodeTitle={'Edit Agent ' +agent.agent_company_name}
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
                                        <AsyncPaginate
                                            required
                                            debounceTimeout={!modelsLoaded ? 2000 : 0}
                                            options={initialOptions}
                                            value={selected_agent_company_name}
                                            name="agent_company_name"
                                            loadOptions={(search, prevOptions) => loadOptions(search, prevOptions, companies, modelsLoaded)}
                                            onChange={e => this.selectChange(e, 'agent_company_name')}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Iata</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            name="iata"
                                            value={agent.iata || ''}
                                            onChange={e => this.handleChange(e)}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Branch</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            name="branch"
                                            value={agent.branch || ''}
                                            onChange={e => this.handleChange(e)}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Cf</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            name="cf"
                                            value={agent.cf || ''}
                                            onChange={e => this.handleChange(e)}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Pec</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            name="pec"
                                            value={agent.pec || ''}
                                            onChange={e => this.handleChange(e)}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Sdi</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            name="sdi"
                                            value={agent.sdi || ''}
                                            maxlength={7}
                                            onChange={e => this.handleChange(e)}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Partita Iva</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            name="p_iva"
                                            value={agent.p_iva || ''}
                                            onChange={e => this.handleChange(e)}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} xs="12">
                                        <Form.Label>Active</Form.Label>
                                        <Checkbox name="is_active" checked={agent.is_active ? true : false}
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
                                            value={agent.address_1 || ''}
                                            onChange={e => this.handleChange(e)}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="3" xs="12">
                                        <Form.Label>Address 2</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            name="address_2"
                                            value={agent.address_2 || ''}
                                            onChange={e => this.handleChange(e)}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="3" xs="12">
                                        <Form.Label>Zip Code</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            name="zip_code"
                                            value={agent.zip_code || ''}
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
                                            value={agent.city || ''}
                                            onChange={e => this.handleChange(e)}
                                        />
                                    </Form.Group>
                                </Form.Row>

                                <div className='pull-right'>
                                    <Link to={"/"+URL_PREFIX+"/agents/list"} className="btn btn-danger">
                                        <i className="la la-remove"/>
                                        Cancel
                                    </Link>
                                    &nbsp;&nbsp;
                                    
                                    <Button type="submit" className="btn btn-primary" onClick={e=>this.setState({submitType:'update'})}>
                                        <i className="la la-save"/>
                                        Update
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

export default withRouter(AgentEdit);