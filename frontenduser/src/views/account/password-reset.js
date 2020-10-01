import React, { Component } from "react";
import { Row, Card, CardTitle, Form, Label, Input, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";
import api from "../../services/api";
import {successNoti, errorNoti} from '../../helpers/Notifications';
import queryString from 'query-string';
import { URL_PREFIX } from "../../constants/defaultValues"

export default class PasswordReset extends Component {
  constructor(props) {
    super(props);
    const {location} = this.props;
    const {key} = queryString.parse(location.search);

    if(!key){
      //Send back to previous URL if no key is mentioned on URL.
    }

    this.state = {
      key,
      password:'',
      confirmPassword:''
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let {password, confirmPassword, key} = this.state;

    api.resetPassword({password, c_password:confirmPassword, key},(err, response) => {
      if(response) {
        if(response.Success) {
          successNoti(response.Success);
        } else {
          successNoti('Password updated successfully');
        }

        //Redirect user to login page.
        this.props.history.push('/'+URL_PREFIX+'/account/login');
      }
      if(err) {
        let {error} = err;

        if(error)
          errorNoti(error);
        else
          errorNoti('Failed to update the password');
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
              <p className="text-white h2">RESET PASSWORD</p>
              <p className="white mb-0">
                Utilizza una password sicura.
              </p>
            </div>
            <div className="form-side">
              <NavLink to={'/'+URL_PREFIX+`/`} className="white">
                <span className="logo-single" />
              </NavLink>
              <CardTitle className="mb-4">
                <IntlMessages id="user.password-reset" />
              </CardTitle>
              <Form
                  noValidate
                  onSubmit={e => this.handleSubmit(e)}
              >
                <Label className="form-group has-float-label mb-4">
                  <Input name="password" type="password" value={this.state.password} onChange={e => this.handleChange(e)} />
                  <IntlMessages id="user.password" />
                </Label>

                <Label className="form-group has-float-label mb-4">
                  <Input name="confirmPassword" type="password" value={this.state.confirmPassword} onChange={e => this.handleChange(e)} />
                  <IntlMessages id="user.confirm-password" />
                </Label>

                <div className="d-flex justify-content-end align-items-center">
                  <Button
                    color="primary"
                    className="btn-shadow btn-multiple-state btn-lg"
                    size="lg"
                    type="submit"
                  >
                    <IntlMessages id="user.reset-password-button" />
                  </Button>
                </div>
              </Form>
            </div>
          </Card>
        </Colxx>
      </Row>
    );
  }
}
