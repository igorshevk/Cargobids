import React, { Component } from "react";
import Icofont from "react-icofont";
import PropTypes from "prop-types";
import CountUp from "react-countup";
import VisibilitySensor from "react-visibility-sensor";
import ScrollAnimation from "react-animate-on-scroll";
import { API_URL } from "../../helpers/Auth";
import axios from "axios";

class FunFacts extends Component {
  state = {
    didViewCountUp: false,
    quoteBidCount: {},
  };

  onVisibilityChange = (isVisible) => {
    if (isVisible) {
      this.setState({ didViewCountUp: true });
    }
  };

  fetchBidQuoteCount = () => {
    axios.get(`${API_URL}qoute-bid-count/`).then((response) => {
      this.setState({
        quoteBidCount: response.data,
      });
    }),
      function (error) {
        alert("An error occured");
      };
  };

  componentDidMount() {
    this.fetchBidQuoteCount();
  }

  render() {
    return (
      <React.Fragment>
        <section id="about" className="fun-facts ptb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 offset-lg-2 text-center">
                <ScrollAnimation animateIn="fadeInUp">
                  <div className="section-title">
                    <h2>{this.props.sectionTitle}</h2>
                    <p>{this.props.sectionDescription}</p>
                    <span className="section-title-bg">
                      {this.props.SectionbgTitle}
                    </span>
                  </div>
                </ScrollAnimation>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-md-4">
                <div className="count-box text-center">
                  <div className="glyph">
                    <Icofont icon="icofont-sub-listing" />
                  </div>
                  {/* Total open quotes */}
                  <p>Inserzioni Aperte</p>
                  <h2 className="counter">
                    <VisibilitySensor
                      onChange={this.onVisibilityChange}
                      offset={{
                        top: 10,
                      }}
                      delayedCall
                    >
                      <CountUp
                        start={0}
                        end={
                          this.state.didViewCountUp
                            ? this.state.quoteBidCount.quotes_count
                            : 0
                        }
                        duration={3}
                      />
                    </VisibilitySensor>
                  </h2>
                </div>
              </div>

              <div className="col-lg-4 col-md-4">
                <div className="count-box text-center">
                  <div className="glyph">
                    <Icofont icon="icofont-download" />
                  </div>
                  <p>Offerte Totali</p>
                  <h2 className="counter">
                    <VisibilitySensor
                      onChange={this.onVisibilityChange}
                      offset={{
                        top: 10,
                      }}
                      delayedCall
                    >
                      <CountUp
                        start={0}
                        end={
                          this.state.didViewCountUp
                            ? this.state.quoteBidCount.bids_count
                            : 0
                        }
                        duration={3}
                      />
                    </VisibilitySensor>
                  </h2>
                </div>
              </div>

              <div className="col-lg-4 col-md-4">
                <div className="count-box text-center">
                  <div className="glyph">
                    <Icofont icon="icofont-users-alt-1" />
                  </div>
                  <p>Utenti Online</p>
                  <h2 className="counter">
                    <VisibilitySensor
                      onChange={this.onVisibilityChange}
                      offset={{
                        top: 10,
                      }}
                      delayedCall
                    >
                      <CountUp
                        start={0}
                        end={this.state.didViewCountUp ? 58 : 0}
                        duration={3}
                      />
                    </VisibilitySensor>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

//Props Types
FunFacts.propTypes = {
  SectionbgTitle: PropTypes.string,
  sectionTitle: PropTypes.string,
  sectionDescription: PropTypes.string,
};

//Default Props
FunFacts.defaultProps = {
  SectionbgTitle: "STATISTICHE",
  sectionTitle: "Statistiche",
  sectionDescription: "Statistiche LIVE:",
};

export default FunFacts;
