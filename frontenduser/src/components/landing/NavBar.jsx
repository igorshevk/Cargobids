import React, { Component } from "react";
import PropTypes from "prop-types";
import Icofont from "react-icofont";
import { NavLink, withRouter } from "react-router-dom";
import { Link } from "react-scroll";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Container, Nav } from "react-bootstrap";
import {isLoggedIn} from '../..//helpers/API';
import {isAirline} from '../..//helpers/API';
import {URL_PREFIX} from "../../constants/defaultValues";
import Logo from '../../assets/img/logo.png';
import Logo2 from '../../assets/img/logo2.png';
// import SearchModal from "./SearchModal";

class NavBar extends Component {
  componentDidMount() {
    let elem = document.getElementById("navbar");
    document.addEventListener("scroll", () => {
      if (window.scrollY > 460) {
        elem.classList.add("menu-shrink");
        elem.classList.add("fixed-top");
      } else {
        elem.classList.remove("menu-shrink");
        // elem.classList.remove("fixed-top");
      }
    });
    window.scrollTo(0, 0);
  }

  closeNavbar() {
    if (window.matchMedia("screen and (max-width: 991px)").matches) {
      document.getElementById("collaspe-btn").click();
    }
  }

  register = () => {
    console.log(this.props);
    this.props.history.push("/"+URL_PREFIX+"/account/register");
  };

  login() {
    this.props.history.push("/"+URL_PREFIX+"/account/login");
  }

  render() {
    console.log('sdsdsdsd', this.props.MainLogo)
    return (
      <React.Fragment>
        {/* Start Top Header */}

        <Navbar
          id="navbar"
          bg="light"
          expand="lg"
          className="navbar navbar-expand-md navbar-light fixed-top"
          collapseOnSelect={true}
        >
          <Container>
            <Navbar.Brand className="navbar-brand logo">
              <React.Fragment>
                <LinkContainer exact to="/">
                  <img src={Logo} alt="Logo" />
                </LinkContainer>
              </React.Fragment>
            </Navbar.Brand>

            <Navbar.Brand className="navbar-brand logo-2">
              <React.Fragment>
                <LinkContainer exact to="/">
                  <img
                    style={{ width: 200 }}
                    className="img-fluid"
                    src={Logo2}
                    alt="Logo"
                  />
                </LinkContainer>
              </React.Fragment>
            </Navbar.Brand>

            <Navbar.Toggle
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
              id="collaspe-btn"
            />
            <Navbar.Collapse id="navbarSupportedContent">
              <Nav className="navbar-nav ml-auto">
                {this.props.pageName === "home" ? (
                  <React.Fragment>
                    <Nav.Item>
                      <Link
                        activeclass="active"
                        to="home"
                        spy={true}
                        smooth={true}
                        offset={-200}
                        duration={800}
                        className="smooths nav-link"
                        onClick={this.closeNavbar}
                      >
                        Home
                      </Link>
                    </Nav.Item>

                    <Nav.Item>
                      <Link
                        activeclass="active"
                        to="services"
                        spy={true}
                        smooth={true}
                        offset={-200}
                        duration={800}
                        className="nav-link"
                        onClick={this.closeNavbar}
                      >
                        Agenti
                      </Link>
                    </Nav.Item>

                    <Nav.Item>
                      <Link
                        activeclass="active"
                        to="about"
                        spy={true}
                        smooth={true}
                        offset={-200}
                        duration={800}
                        className="nav-link"
                        onClick={this.closeNavbar}
                      >
                        Vettori
                      </Link>
                    </Nav.Item>

                    <Nav.Item>
                      <Link
                        activeclass="active"
                        to="contact"
                        spy={true}
                        smooth={true}
                        offset={-200}
                        duration={800}
                        className="nav-link"
                        onClick={this.closeNavbar}
                      >
                        Contatti
                      </Link>
                    </Nav.Item>
                    {!isLoggedIn() ? 
                    <>
                    <Nav.Item>
                      <div
                        activeclass="active"
                        to={"/"+URL_PREFIX+"/account/login"}
                        spy={true}
                        smooth={true}
                        offset={-200}
                        duration={800}
                        className="smooths nav-link"
                        onClick={() => {
                          this.login();
                        }}
                      >
                        Log In
                      </div>
                    </Nav.Item>
                    <Nav.Item>
                      <Link
                        activeclass="active"
                        to={"/"+URL_PREFIX+"/account/register"}
                        className="smooths nav-link"
                        onClick={this.register}
                      >
                        Register
                      </Link>
                    </Nav.Item>
                    </>:(isAirline() ? <Nav.Item>
                      <a href={"/"+URL_PREFIX+"/airline/dashboard"} className="nav-link" activeClassName="">
                        Account
                      </a>
                    </Nav.Item>:<Nav.Item>
                      <a href={"/"+URL_PREFIX+"/agent/dashboard"} className="nav-link" activeClassName="">
                        Account
                      </a>
                    </Nav.Item>)}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Nav.Item>
                      <NavLink to="/" className="nav-link" activeClassName="">
                        Home
                      </NavLink>
                    </Nav.Item>

                    <Nav.Item>
                      <NavLink to="/" className="nav-link" activeClassName="">
                        Agenti
                      </NavLink>
                    </Nav.Item>

                    <Nav.Item>
                      <NavLink to="/" className="nav-link" activeClassName="">
                        Vettori
                      </NavLink>
                    </Nav.Item>

                    <Nav.Item>
                      <NavLink to="/" className="nav-link" activeClassName="">
                        Contatti
                      </NavLink>
                    </Nav.Item>
                  </React.Fragment>
                )}
              </Nav>
            </Navbar.Collapse>

            {/* <div className="header-search">
                        <SearchModal />
                    </div> */}
          </Container>
        </Navbar>
        
      </React.Fragment>
    );
  }
}
//Props Types
NavBar.propTypes = {
  mailLink: PropTypes.string,
  mail: PropTypes.string,
  numberLink: PropTypes.string,
  Number: PropTypes.string,
  facebookLink: PropTypes.string,
  twitterLink: PropTypes.string,
  instagramLink: PropTypes.string,
  linkedinLink: PropTypes.string,
  MainLogo: PropTypes.string,
  Logo2: PropTypes.string
};

//Default Props
NavBar.defaultProps = {
  MainLogo: "../../assets/img/logo.png",
  Logo2: "../../assets/img/logo.png",
  mailLink: "mailto:name@email.com",
  mail: "support@roxy.com ",
  numberLink: "callto:+4917640206387",
  Number: "+4917640206387",
  facebookLink: "//facebook.com/envato",
  twitterLink: "//twitter.com/envato",
  instagramLink: "//instagram.com/envato/"
};
export default withRouter(NavBar);
