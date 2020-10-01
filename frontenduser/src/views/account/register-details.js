import React, { Component } from "react";
import { Row, Card, Form, Label, Input, Button } from "reactstrap";
import { NavLink } from "react-router-dom";

import { Colxx } from "../../components/common/CustomBootstrap";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Stepper  from "react-stepper-horizontal"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from 'react-loader-spinner'
import {
  ACCOUNT_AGENT,
  ACCOUNT_AIRLINE,
} from '../../redux/actions';
import { URL_PREFIX } from "../../constants/defaultValues"

toast.configure();
class RegisterDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValues:{
        email:"",
        password:"",
        phoneNumber:""
      },
      nextloading:false,
      preview:null,
      loading:false,
      preview_back:null,
      preview_front:null,
      isChecked:false,
      email: "demo@gogo.com",
      password: "gogo123",
      name: "Sarah Kortney",
      step:0,
      type: 'agent',
      startDate:new Date(),
      steps: [{
        title: 'Account Type',
        href: 'http://example0.com',
        onClick: (e) => {
          e.preventDefault()
          console.log('onClick', 0)
        }
      }, {
        title: 'Personal Information',
        href: 'http://example1.com',
        onClick: (e) => {
          e.preventDefault()
          console.log('onClick', 1)
        }
      }, {
        title: 'Register',
        href: 'http://example2.com',
        onClick: (e) => {
          e.preventDefault()
          console.log('onClick', 2)
        }
      }

      ],

      currentStep: 0,
    };
  }
  componentDidMount(){
    // toast('message', { type: toast.TYPE.ERROR });
  }
  handleChangeChk(){
    this.setState({isChecked:!this.state.isChecked})
  }
  onUserRegister() {
    if(!this.state.isChecked){
      this.warningDisplay("Please check terms and conditions")
    } else {
      if (this.state.type == 'agent') {
        localStorage.setItem('accountType', ACCOUNT_AGENT);
        this.props.history.push('/'+URL_PREFIX+"/agent/membership")
      } else if (this.state.type == 'airline') {
        localStorage.setItem('accountType', ACCOUNT_AIRLINE);
        this.props.history.push('/'+URL_PREFIX+"/airline")
      }
    }
  }
  handleChangeDate(date,e) {
    e.preventDefault()
    e.stopPropagation();
    this.setState({
      startDate: date
    });
  };
  warningDisplay(message){
    toast(message, { type: toast.TYPE.ERROR });
  }
  successDisplay(message){
    toast(message, { type: toast.TYPE.SUCCESS });
  }
  
  verification(){

  }

  goAgent() {
    this.setState({
      step:1,
      type: 'agent'
    })
    localStorage.setItem('accountType', ACCOUNT_AGENT);
  }

  goAirline() {
    this.setState({
      step:2,
      type: 'airline'
    })
    localStorage.setItem('accountType', ACCOUNT_AIRLINE);
  }

  goNext(){
    let {currentValues}=this.state
    let {step}=this.state
    // email verification
    if(step==0){
      this.setState({step:step+1})
    }
    // in case of agent
    if(step==1){
      this.setState({step:step+2})
    }
    // in case of airline 
    if(step==2){
      this.setState({step:step+1})
    }
    //if(step<4){this.setState({step:step+1})}
  }
  changeValue(type,e){
    this.state.currentValues[type] = e.target.value
    this.setState({currentValues:this.state.currentValues})
  }

  render() {
    // let {step}=this.state
    const {loading,nextloading, steps, step,currentValues,isChecked,preview,preview_front,preview_back} = this.state;

    return (
      <Row className="h-100 register">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <NavLink to={'/'+URL_PREFIX+`/account/login`} style={{fontSize: '14px', fontWeight:'bold', color:'#fe5619', position:'absolute', right:'20px', top:'20px'}}>
              Vai alla pagina di Login!
            </NavLink>
            <div className="form-side">
              <div  style={{textAlign:'center'}}>
                <h1>Benvenuto!</h1>
              </div>
              <Stepper steps={ steps } activeStep={ step } disabledSteps={[]}/>
                <div className="main-pad mt-5">
                <div className="text-center" style={{display:step==0?"block":"none"}}>
                  <Label className="form-group has-float-label mb-4">
                    Seleziona il tipo di account che intendi creare.
                  </Label>
                  <div className="d-flex justify-content-center align-items-center" style={{backgroundColor:'white',padding:10,marginTop:20}}>
                    <Button
                      style={{display:step==0?"block":"none"}}
                      color="primary"
                      className="btn-shadow btn-multiple-state btn btn-lg mr-2"
                      size="lg"
                      onClick={() => {this.goAgent()}}>
                      AGENTE IATA
                    </Button>
                    <Button
                      style={{display:step==0?"block":"none"}}
                      color="primary"
                      className="btn-shadow btn-multiple-state btn-lg btn mr-2"
                      size="lg"
                      onClick={() => {this.goAirline()}}>
                      VETTORE/GSA
                    </Button>
                  </div>
                </div>
                {/* START: agent register */}
                <Form style={{display:step==1?"block":"none"}}>
                  <Label className="form-group has-float-label mb-4">
                    Nome
                    <Input type="name" defaultValue={this.state.firstname} onChange={this.changeValue.bind(this,'firstname')}/>
                  </Label>
                  <Label className="form-group has-float-label mb-4">
                   Cognome
                    <Input type="text" defaultValue={this.state.lastname}  onChange={this.changeValue.bind(this,'lastname')} />
                  </Label>
                  <Label className="form-group has-float-label mb-4">
                    Indirizzo
                    <Input type="name" defaultValue={this.state.address}  onChange={this.changeValue.bind(this,'address')} />
                  </Label>
                  <Label className="form-group has-float-label mb-4">
                    Citta'
                    <Input type="text" defaultValue={this.state.city}  onChange={this.changeValue.bind(this,'city')}  />
                  </Label>
                  <Label className="form-group has-float-label mb-4">
                    Comune
                    <Input type="text" onChange={this.changeValue.bind(this,'countryState')}  />
                  </Label>
                  <Label className="form-group has-float-label mb-4">
                    Zip
                    <Input type="text"  onChange={this.changeValue.bind(this,'zipCode')}  />
                  </Label>
                  <Label className="form-group has-float-label mb-4">
                    Data di Nascita
                    <DatePicker
                      selected={moment(this.state.startDate)}
                      onChange={this.handleChangeDate.bind(this)}
                      placeholderText={"date pick"}
                    />
                    </Label>
                   <Label className="form-group has-float-label mb-4">
                    Driver License
                    <Input type="text" onChange={this.changeValue.bind(this,'driverLicense')} />
                   </Label>
                </Form>
                {/* START: airline register */}
                <Form style={{display:step==2?"block":"none"}}>
                  <Label className="form-group has-float-label mb-4">
                    First Name
                    <Input type="name" defaultValue={this.state.firstname} onChange={this.changeValue.bind(this,'firstname')}/>
                  </Label>
                  <Label className="form-group has-float-label mb-4">
                    Last Name
                    <Input type="text" defaultValue={this.state.lastname}  onChange={this.changeValue.bind(this,'lastname')} />
                  </Label>
                </Form>
                <Form style={{display:step==3?"block":"none"}}>
                  <Label className="form-group has-float-label mb-4">
                    User name
                    <div className="d-flex flex-row align-items-center">
                    <Input type="email"  value={currentValues.username}   onChange={this.changeValue.bind(this,'username')}/>
                    </div>
                  </Label>
                  <Label className="form-group has-float-label mb-4">
                     Password
                    <Input type="password" defaultValue={currentValues.password} value={currentValues.password} onChange={this.changeValue.bind(this,'password')}/>
                   </Label>
                   <Label className="form-group has-float-label mb-4">
                     Confirm Password
                    <Input type="password" defaultValue={currentValues.confirmPassword} value={currentValues.confirmPassword} onChange={this.changeValue.bind(this,'confirmPassword')}/>
                   </Label>
                   <div className="d-flex flex-row align-items-center">
                      <input type="checkbox" defaultChecked={isChecked} onChange={()=>{this.handleChangeChk()}}/>
                      <div className="ml-2">Terms and Condition</div>
                  </div>
                </Form>
                <div className="d-flex justify-content-end align-items-center" style={{backgroundColor:'white',padding:10,marginTop:20}}>
                  <Button
                    style={{display:step>0?"block":"none"}}
                    color="primary"
                    className="btn-shadow btn-multiple-state btn-lg btn mr-2"
                    size="lg"
                    onClick={() => {if(step>0){this.setState({step:step-1})}}}>
                     Previous
                  </Button>
                  <Button
                    style={{display:(step>0 && step!=3)?"block":"none"}}
                    color="primary"
                    className="btn-shadow btn btn-multiple-state btn-lg mr-2"
                    size="lg"
                    onClick={() => {this.goNext()}}>
                      {!nextloading && <div>Next</div>}
                      {nextloading && <Loader type="Oval" color="white" height={20} width={20} />}
                  </Button>
                  <Button
                    style={{display:step==3?"block":"none"}}
                    color="primary"
                    className="btn-shadow btn-multiple-state btn btn-lg mr-2"
                    size="lg"
                    onClick={() => this.onUserRegister()}
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </Colxx>
      </Row>
    );
  }
}
export default RegisterDetails
// const mapStateToProps = ({ authUser }) => {
//   const { user, loading } = authUser;
//   return { user, loading };
// };

// export default connect(
//   mapStateToProps,
//   {
//     registerUser
//   }
// )(Register);
