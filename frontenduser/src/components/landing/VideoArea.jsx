import React, { Component } from "react";
import PropTypes from "prop-types";
import "react-modal-video/css/modal-video.min.css";
import ModalVideo from "react-modal-video";
import logo_medium from "../../assets/img/logo_medium.png";

class VideoArea extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
    };
    this.openModal = this.openModal.bind(this);
  }
  openModal() {
    this.setState({ isOpen: true });
  }
  render() {
    return (
      <React.Fragment>
        <section id="home" className="video-area video-bg">
          <div className="diplay-table">
            <div className="display-table-cell">
              <div className="banner">
                <div>
                  <hr />
                  <img src={logo_medium} className="logo_medium" alt="logo" />
                </div>
                <div className="video-inner-content">
                  <h1>{this.props.Title}</h1>
                  <div className="button__holder">
                    <ModalVideo
                      channel="youtube"
                      isOpen={this.state.isOpen}
                      videoId="OjE_vHA5ZJE"
                      onClose={() =>
                        this.setState({
                          isOpen: false,
                        })
                      }
                    />
                    <span
                      onClick={this.openModal}
                      className="plus popup-youtube"
                    ></span>
                  </div>
                </div>
                <br /> <br />
                <p style={{ color: "#ffffff" }}>{this.props.Content}</p>
                <hr />
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}
VideoArea.propTypes = {
  Title: PropTypes.string,
  Content: PropTypes.string,
};
VideoArea.defaultProps = {
  Title: "Connecting The Airfreight Marketplace",
  Content: "Come Funziona",
};
export default VideoArea;
