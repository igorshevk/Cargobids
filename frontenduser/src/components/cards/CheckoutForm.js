import React from 'react';
import {ElementsConsumer, CardElement} from '@stripe/react-stripe-js';

import CardSection from './CardSection';

import api from "../../services/api";
import {successNoti, errorNoti, infoNoti} from '../../helpers/Notifications';
import {getUser, updateUser, isAgent, isAirline} from '../../helpers/API';
import {URL_PREFIX} from "../../constants/defaultValues";
import IntlMessages from "../../helpers/IntlMessages";


class CheckoutForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        users: getUser(),
      };
    }

  handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    const {stripe, elements, history} = this.props

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make  sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        email: this.state.users.email,
      },
    });

       if (result.error) {
          } else {
          this.props.setloader('');
          let paymentdata = {
              plan_id : this.props.selectedOption, // later will make it dyanmic email
              user_id :this.state.users.user_id,
              user_email :this.state.users.email,
              payment_method: result.paymentMethod.id
          }
        api.paymentDetails(paymentdata,(err, response)=>{
            if(response){
              if('auto_approve' in response) {
                if(response.auto_approve === true)
                    successNoti('Your subscription has been updated successfully!');

                api.getCurrentUser('',(err, resp)=>{
                    resp.user_id = resp.id;
                    localStorage.setItem('persist:cargobid-auth', JSON.stringify(resp));
                    if(response.auto_approve === true) {
                      if(isAgent())
                        this.props.history.push("/"+URL_PREFIX+'/agent/dashboard');
                      else
                        this.props.history.push("/"+URL_PREFIX+'/airline/dashboard');
                    } else {
                      if(isAgent())
                        this.props.history.push("/"+URL_PREFIX+'/agent/welcome');
                      else
                        this.props.history.push("/"+URL_PREFIX+'/airline/welcome');
                    }
                    this.setState({requestSent:true});
                });
              }
            } else {
              errorNoti('Subscription request failed');
            }
         });
   }
  };

  render() {
    const {stripe} = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        <CardSection />
        <div>
          <br/>
          <button onClick={() => {infoNoti('Non puoi accedere ai contenuti senza avere sottoscritto un Piano Tariffario!'); this.props.toggle(); }} className="btn-shadow btn-multiple-state btn btn-danger btn-lg">
            Cancel
          </button> &nbsp;&nbsp;
          <button type="submit" className="btn-shadow btn-multiple-state btn btn-primary btn-lg" onClick={(e) => warningNoti('Non puoi accedere ai contenuti senza avere sottoscritto un Piano Tariffario!')} disabled={!stripe}>
            <IntlMessages id="membership.Subscribe" />
          </button>
        </div>
      </form>
    );
  }
}

export default function InjectedCheckoutForm(props) {
  return (
    <ElementsConsumer>
      {({stripe, elements}) => (
        <CheckoutForm toggle={props.toggle} setloader={props.setloader} selectedOption={props.selectedOption}  stripe={stripe} elements={elements} history={props.history} />
      )}
    </ElementsConsumer>
  );
}