import React, {Component} from "react"
import {Link, withRouter} from 'react-router-dom';
import {Button, Form, Col} from "react-bootstrap";
import Select from 'react-select';
import {BoxContainerBasic} from "../../partials/content/BoxContainer";
import {get, patch} from '../../crud/api';
import {getRoles,getAgents, getAirlines} from "../../helpers/commons";
import notify from "../../helpers/Notifications";
import {URL_PREFIX} from "../../constants/defaultValues"


class UserEdit extends Component {
    constructor(props) {
        super(props);
        const {params: {user_id}} = this.props.match;

        this.state = {
            validated: false,
            user: {
                firstname: '',
                lastname: '',
                city: '',
                zip_code: '',
                address: '',
                address2: '',
                agent_company_id:null,
                is_active:false
            },
            agent:{
                branch:'',
                address: '',
                address2: '',
                zip_code:'',
                city:'',
                p_iva:'',
                cf:'',
                pec:'',
                sdi:'',
                iata:''
            },
            airline:{
                branch:'',
            },
            roles: {},
            assigned_role: {value: ''},

            //Agents
            agents:[],
            selected_agent: {value: ''},

            //Airlines
            airlines:[],
            selected_airline: {value: ''},
        };

        this.getUser(user_id);
    }

    componentDidMount() {
        //Fetching Agents List.
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('Component state updated');
    }


    loadAgents = async () => {
        let loadedAgents = [];
        let agentName = 'agent_company_name';
        let agentIATA = 'iata';
        await getAgents()
            .then((agents)=>{
                console.log('agents response',agents);
                agents = agents.map((agent,i)=>{
                    agent['label'] = agent[agentName] + (agent[agentIATA] === null ? '' :   ' - '+agent[agentIATA]);
                    agent['value'] = agent.id

                    if(agent.id == this.state.user.agent_company.id)
                        this.setState({selected_agent:agent});

                    return agent
                });
                loadedAgents = agents
            })
            .catch(error=>{
                console.log('error While Fetching', error);
            });

        this.setState({agents:loadedAgents});
    };


    loadAirlines = async () => {
        let loadedAirlines = [];
        let airlineName = 'airline_company_name';
        let airlineIATA = 'iata';
        await getAirlines()
            .then((airlines)=>{
                console.log('airlines response',airlines);
                airlines = airlines.map((airline,i)=>{
                    airline['label'] = airline[airlineName];
                    airline['value'] = airline.id;

                    if(airline.id == this.state.user.airline_company.id)
                        this.setState({selected_airline:airline});

                    return airline;
                });
                loadedAirlines = airlines
            })
            .catch(error=>{
                console.log('error While Fetching', error);
            });

        this.setState({airlines:loadedAirlines});
    };
    getUser = (user_id) => {
        get('users/' + user_id + '/')
            .then(
                (response) => {

                    let {
                        data: {
                            id,
                            firstname,
                            lastname,
                            email,
                            is_active,
                            groups,
                            agent_company,
                            airline_company,
                            city,
                            address,
                            address2,
                            zip_code,
                            email_verified
                        }
                    } = response;
                    let selectedAgent = {}
                    let selectedAirline = {}

                    let agentID,agent_company_name,iata,branch,agent_company_id=null, airline_company_id=null
                    if(agent_company && agent_company.id && agent_company.agent_company_name) {
                        let {agentID:id,agent_company_name,iata,branch} = agent_company;
                        selectedAgent = {value:id,label:agent_company_name + (iata !== null ? ' - ' + iata : '')}
                        agent_company_id = agent_company.id
                    }
                    if(airline_company && airline_company.id && airline_company.airline_company_name) {
                        let {airlineID:id,airline_company_name,branch} = airline_company;
                        selectedAirline = {value:id,label:airline_company_name}
                        airline_company_id = airline_company.id
                    }

                    let roles = this.getUserRole({groups}); //It will save the Roles in State.
                    roles.then(roles => {

                        //Finally set the State.
                        this.setState({
                            user: {
                                id, firstname, lastname, email, is_active:(is_active === 1), groups: groups[0], agent_company, airline_company, city, address, address2, zip_code,
                                agent_company_id, airline_company_id
                            },
                            roles,
                            selected_agent:selectedAgent,
                            selected_airline:selectedAirline,
                            agent: {
                                branch, iata,
                            },
                            airline: {
                                branch
                            }
                        });

                                        
                        let loadedAgents = this.loadAgents();
                        loadedAgents.then(agents => {console.log('loaded Agents', agents)})

                        let loadAirlines = this.loadAirlines();
                        loadAirlines.then(airlines => {console.log('loaded airlines', airlines)})
                    });
                });
    };

    getUserRole = async ({groups}) => {
        let userRoles = {};
        await getRoles()
            .then((roles) => {
                roles = roles.map(({id, name}, i) => {
                    //If Group Matches
                    if (groups[0] === id) {
                        //Set the state, might be useful later.
                        this.setState({
                            assigned_role: {value: id, label: name}
                        });
                        //selected option with the user group only.
                        return {value: id, label: name, selected: true}
                    } else
                        return {value: id, label: name}
                });
                userRoles = roles;
            })
            .catch(/*error=>errorNoti('Failed to Fetch system Roles')*/);
        return userRoles;
    };

    handleChange(e, type) {
        if (type)
            this.state[type][e.target.name] = e.target.value;
        else
            this.state[e.target.name] = e.target.value;
        this.setState(this.state);
    }

    selectChange = (value, stateKey, stateUserKey = null) => {
        let {user} = this.state;
        if (stateUserKey) {
            user[stateUserKey] = value.value;
        }
        this.setState({[stateKey]: value, user});
    };

    handleSubmit = (e) => {
        let form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        let {user: {id, firstname, lastname, groups, agent_company_id, airline_company_id, address, address2, city, zip_code,is_active}, submitType} = this.state;
        let agent_branch = this.state.agent.branch, airline_branch = this.state.airline.branch;


        if(!submitType && is_active===false) {
            return false;
        }

        if(!is_active && submitType === 'updateAndActivate') {
            is_active=true;
        }

        if(agent_company_id) { //Only if we have agent company id
            //Currently Only Updating the Branch, will update more if required.
            patch('agents/' + agent_company_id + '/', {branch:agent_branch})
                .then(res => {
                    console.log('update agent response', res);
                })
                .catch(err => {
                    console.log('err update agent', err);
                });
        }

        if(airline_company_id) { //Only if we have agent company id
            //Currently Only Updating the Branch, will update more if required.
            patch('airlines/' + airline_company_id + '/', {branch:airline_branch})
                .then(res => {
                    console.log('update airline response', res);
                })
                .catch(err => {
                    console.log('err update airline', err);
                });
        }
        patch('users/' + id + '/', {firstname, lastname, groups: [groups], agent_company:agent_company_id, airline_company:airline_company_id, address, address2, city, zip_code, is_active:(is_active)?1:0})
            .then(res => {
                if (res.data) {
                    notify.success('User record successfully updated');
                    this.props.history.push("/"+URL_PREFIX+"/users");
                } else {
                    notify.error('Failed to update the records');
                }
            })
            .catch(error => {
                console.log(error);
                // notify.error('Failed to update the recordd')
            });

    };


    render() {
        const {user: {firstname, lastname, city, zip_code, address, address2, is_active, agent_company,airline_company},
            roles, assigned_role,
            // agents
            agents,selected_agent,
            // airlines
            airlines,
            selected_airline
        } = this.state;
        const agent_branch = this.state.agent.branch;
        const airline_branch = this.state.airline.branch;
       console.log(this.state.airline);

        const buttons = <Link to={"/"+URL_PREFIX+"/users"} className="btn btn-clean btn-icon-sm">
            <i className="la la-long-arrow-left"></i>
            Back
        </Link>;

        return (

            <div className="row">
                <div className="col-md-12">
                    <BoxContainerBasic
                        beforeCodeTitle={'Edit User ' + ((firstname || lastname) ? '(' + firstname + (lastname ? ' ' + lastname : '') + ')' : '')}
                        afterTitleRight={buttons}
                    >
                        <div className="kt-section">

                            <Form
                                noValidate
                                onSubmit={e => this.handleSubmit(e)}
                            >
                                <Form.Row>
                                    <div className="col-12">
                                        <h5>Personal Information</h5>
                                        <hr/>
                                    </div>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            placeholder="John"
                                            name="firstname"
                                            value={firstname || ''}
                                            onChange={e => this.handleChange(e, 'user')}
                                            onBlur={e => this.handleChange(e, 'user')}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            placeholder="Doe"
                                            name="lastname"
                                            value={lastname || ''}
                                            onChange={e => this.handleChange(e, 'user')}
                                            onBlur={e => this.handleChange(e, 'user')}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4" xs="12">
                                        <Form.Label>Role</Form.Label>
                                        <Select
                                            value={assigned_role}
                                            model="user"
                                            name="groups"
                                            onChange={(e) => this.selectChange(e, 'assigned_role', 'groups')}
                                            options={roles}
                                        />
                                    </Form.Group>
                                </Form.Row>


                                {/*Agent Fields*/}
                                {
                                    assigned_role && assigned_role.label === 'Agent' && <>
                                        <Form.Row>
                                            <div className="col-12">
                                                <h5>Agent Information</h5>
                                                <hr/>
                                            </div>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col} md="6" xs="12">
                                                <Form.Label>Agent</Form.Label>
                                                <Select
                                                    value={selected_agent}
                                                    name="agent"
                                                    onChange={e => this.selectChange(e, 'selected_agent','agent_company_id')}
                                                    options={agents}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="3" xs="12">
                                                <Form.Label>Branch</Form.Label>
                                                <Form.Control
                                                    required
                                                    readOnly={true}
                                                    type="text"
                                                    placeholder=""
                                                    name="branch"
                                                    value={selected_agent.branch}
                                                    onChange={e => this.handleChange(e, 'agent')}
                                                />
                                            </Form.Group>

                                        </Form.Row>
                                    </>
                                }


                                {/*Airline Fields*/}
                                {
                                    assigned_role && assigned_role.label === 'Airline' && <>
                                        <Form.Row>
                                            <div className="col-12">
                                                <h5>Airline Information</h5>
                                                <hr/>
                                            </div>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col} md="6" xs="12">
                                                <Form.Label>Airline</Form.Label>
                                                <Select
                                                    value={selected_airline}
                                                    name="airline"
                                                    onChange={e => this.selectChange(e, 'selected_airline','airline_company_id')}
                                                    options={airlines}
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} md="3" xs="12">
                                                <Form.Label>Branch</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    placeholder=""
                                                    name="branch"
                                                    value={selected_airline.branch}
                                                    onChange={e => this.handleChange(e, 'airline')}
                                                />
                                            </Form.Group>
                                        </Form.Row>
                                    </>
                                }

                                <div className='pull-right'>
                                    <Link to={"/"+URL_PREFIX+"/users/list"} className="btn btn-danger">
                                        <i className="la la-remove"/>
                                        Cancel
                                    </Link>
                                    &nbsp;&nbsp;
                                    
                                    {is_active && <Button type="submit" className="btn btn-primary" onClick={e=>this.setState({submitType:'update'})}>
                                        <i className="la la-save"/>
                                        Update
                                    </Button>}

                                    {!is_active && <Button type="submit" className="btn btn-success" onClick={e=>this.setState({submitType:'updateAndActivate'})}>
                                        <i className="la la-save"/>
                                        Update & Activate
                                    </Button>}

                                </div>
                            </Form>
                        </div>
                    </BoxContainerBasic>
                </div>
            </div>
        );
    }
}

export default withRouter(UserEdit);