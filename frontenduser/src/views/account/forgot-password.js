import React, { Component } from "react";
import { Row, Card, CardTitle, Form, Label, Input, Button } from "reactstrap";
import {Link, NavLink} from "react-router-dom";
import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";
import api from "../../services/api";
import {successNoti, errorNoti} from '../../helpers/Notifications';
import { URL_PREFIX } from "../../constants/defaultValues"

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      requestSent:false
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let {email} = this.state;


    api.forgotPassword({email},(err, response)=>{
      if(response){
        successNoti('Richiesta correttamente inviata');
        this.setState({requestSent:true})
      }

      if(err) {
        console.log('has errors',err);
        errorNoti('Failed to dispatch password reset request');
      }
    });
  };

  handleChange(e) {
      this.state[e.target.name] = e.target.value;
    this.setState(this.state);
  }

  render() {
    return (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="position-relative image-side ">
              <p className="text-white h2">RICHIEDI NUOVA PASSWORD</p>
              <p className="white mb-0">
                Usa la tua e-mail per resettare la tua password. <br />
                Se non sei un utente registrato, {" "}
                <NavLink to={'/'+URL_PREFIX+`/register`} className="white">
                  registrati.
                </NavLink>
                .
              </p>
            </div>
            <div className="form-side">
              <NavLink to={'/'+URL_PREFIX+`/`} className="white">
                <span className="logo-single" />
              </NavLink>

              {!this.state.requestSent && <>
                <CardTitle className="mb-4">
                  <IntlMessages id="user.forgot-password" />
                </CardTitle>
                <Form
                    noValidate
                    onSubmit={e => this.handleSubmit(e)}
                >
                  <Label className="form-group has-float-label mb-4">
                    <Input name="email" type="email" value={this.state.email} onChange={e => this.handleChange(e)} />
                    <IntlMessages id="user.email" />
                  </Label>

                  <div className="d-flex justify-content-end align-items-center">
                    <Button
                        color="primary"
                        className="btn-shadow"
                        size="lg"
                        type="submit"
                    >
                      <IntlMessages id="user.reset-password-button" />
                    </Button>
                  </div>
                </Form>
              </>}

              {this.state.requestSent && <>
                <CardTitle className="mb-4">
                  {/*<IntlMessages id="user.register"/>*/}
                  <h3>Richiesta di nuova password ricevuta.</h3>
                </CardTitle>
                <p>
                  La tua richiesta per una nuova password e' stata ricevuta.Ti invieremo una e-mail all'indirizzo fornito in fase di registrazione</p>
                <div className="d-flex justify-content-end align-items-center">
                  <Link to={'/'+URL_PREFIX+"login"} color="primary" className="btn btn-primary btn-shadow">
                    <i className="la la-long-arrow-left"></i>
                    Vai alla pagina di Login
                  </Link>
                </div>

              </>}

            </div>
          </Card>
        </Colxx>
      </Row>
    );
  }
}
