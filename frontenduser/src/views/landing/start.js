import React, { Component, Fragment } from "react";

import NavBar from "../../components/landing/NavBar";
import VideoArea from "../../components/landing/VideoArea";
import Services from "../../components/landing/Services";
import About from "../../components/landing/About";
import FunFacts from "../../components/landing/FunFacts";
import Testimonials from "../../components/landing/Testimonials";
import WelcomeServices from "../../components/landing/WelcomeServices";
import Contact from "../../components/landing/Contact";
import Footer from "../../components/landing/Footer";

import "../../assets/css/components/landing/color/color-default.css";
import "../../assets/css/components/landing/style.css";
import "../../assets/css/components/landing/responsive.css";
import api from "../../services/api";
import {successNoti, errorNoti} from '../../helpers/Notifications';

export default class Start extends Component {
  constructor(props) {
    super(props);

      console.log(this.props);
    if(this.props.match.params.trial_key !== undefined) {
      this.activateTrial();
    }

  }

  activateTrial() {
    api.activateTrial({
      trial_key:this.props.match.params.trial_key

    },(response)=>{ 
      
      if(response.success !== undefined && response.success === true) {
        successNoti('Request for trial period has been sent!')
      }
        this.props.history.push('/');

    })
  }

  render() {
    return (
      <Fragment>
        <NavBar pageName="home" />
        <VideoArea />
        <Services />
        <About />
        <FunFacts />
        {/* <Testimonials /> */}
        <WelcomeServices />
        <Contact />
        <Footer />
      </Fragment>
    );
  }
}

