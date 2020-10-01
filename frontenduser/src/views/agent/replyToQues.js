import React from "react";
import { Input, Tooltip } from "reactstrap";
import { API_URL } from "../../helpers/Auth";
import { getConfig } from "../../helpers/API";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { errorNoti, successNoti } from "../../helpers/Notifications";

const wrapperStyle = {
  padding: "2rem",
  width: "80%",
  margin: "auto",
};

export default class Answer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipOpen2: false,
      tooltipOpen3: false,
      author: null,
      company: null,
      id: null,
      quote: null,
      quoteTitle: null,
      content: "",
      show: "pending",
      reply: "",
      disabled: false,
    };
  }
  componentDidMount() {
    debugger
    // delete redirect from localStoreg
    localStorage.removeItem("redirect")
    const id = this.props.location.search.match(/(\d+)/)[0];
    const config = getConfig();
    const values = { question_id: id };
    axios.post(API_URL + "virificationquestion", values, config).then(
      (res) => {
        console.log(res.data);
        this.setState({
          show: "before-publish",
          author: res.data.airlineName,
          company: res.data.company,
          id: res.data.id,
          quote: res.data.quote,
          content: res.data.content,
          quoteTitle: res.data.quoteTitle,
        });
      },
      (err) => {
        console.log(err.response.data);
        this.setState({ show: "false" });
      }
    );
  }

  onReply = () => {
    const reply = this.state.reply;
    const config = getConfig();
    if (!reply) {
      errorNoti("Inserisci una risposta!");
    } else {
      const values = {
        replay: reply,
      };
      axios
        .post(API_URL + `publish_question/${this.state.id}/`, values, config)
        .then(
          (res) => {
            successNoti("La tua risposta é stata pubblicata! ");
            this.setState({ show: "after-publish" });
          },
          (err) => {
            console.log(err.response.data);
            errorNoti("Error occured try again please");
          }
        );
    }
  };

  onDiscard = () => {
    const reply = this.state.reply;
    const config = getConfig();
    const values = {
      replay: reply,
    };
    axios
      .post(API_URL + `discard_question/${this.state.id}/`, values, config)
      .then(
        (res) => {
          successNoti("This question has been deleted successfully");
          this.setState({ show: "after-publish" });
        },
        (err) => {
          console.log(err.response.data);
          errorNoti("Error occured try again please");
        }
      );
  };

  onInputChange = (e) => {
    this.setState({ reply: e.target.value });
  };

  toggle2 = () => {
    this.setState({
      tooltipOpen2: !this.state.tooltipOpen2,
    });
  };
  toggle3 = () => {
    this.setState({
      tooltipOpen3: !this.state.tooltipOpen3,
    });
  };

  render() {
    if (this.state.show === "pending") {
      return <h3> Loading... </h3>;
    } else if (this.state.show === "false") {
      console.log("lollll")
      debugger
      return <Redirect to="/" />;
    } else if (this.state.show === "before-publish") {
      return (
        <div style={wrapperStyle}>
          <div style={{ marginBottom: "10px" }}>
            <h1 style={{ color: "#ff4500" }}> TITOLO INSERZIONE:  {this.state.quoteTitle} </h1>
            <hr />
          </div>
          <div style={{ marginBottom: "10px", color: "Dodgerblue" }}>
            {" "}
            Autore della domanda: {this.state.author}
            <br /> Azienda: {" "}
            {this.state.company}{" "}
          </div>
          <br />
          <div style={{ marginBottom: "10px", color: "Dodgerblue", fontSize: "18px" }}>
            <br></br> DOMANDA : {this.state.content}{" "}
          </div>
          <br />
          <hr />
          <br />
          <div style={{ marginBottom: "10px", fontSize: "18px", color: "Dodgerblue", }}> RISPONDI : </div>
          <Input
            onChange={this.onInputChange}
            value={this.state.reply}
            placeholder="Inserisci qui la tua risposta"
          />
          <div
            className="mt-4"
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <button
              onClick={this.onReply}
              className="btn-shadow btn-multiple-state btn btn-success btn-lg"
              disabled={this.state.disabled}
            >
              Rispondi &nbsp;&nbsp;
            <i id="Tooltipdeadline" className="fa fa-question-circle" aria-hidden="true" id="Tooltipdeadline3"></i>
            </button>
            <Tooltip
              placement="right"
              isOpen={this.state.tooltipOpen3}
              target="Tooltipdeadline3"
              toggle={this.toggle3}
            >
              Rispondi e pubblica la tua risposta (sará visibile anche agli
              altri utenti)
            </Tooltip>
            <button
              onClick={this.onDiscard}
              className="btn-shadow btn-multiple-state btn btn-danger btn-lg ml-2"
              disabled={this.state.disabled}
            >
              Rifiuta &nbsp;&nbsp;
            <i id="Tooltipdeadline" className="fa fa-question-circle" aria-hidden="true" id="Tooltipdeadline2"></i>
            </button>
            <Tooltip
              placement="right"
              isOpen={this.state.tooltipOpen2}
              target="Tooltipdeadline2"
              toggle={this.toggle2}
            >
              Rifiuta se non vuoi rispondere o pubblicare altre informazioni.
            </Tooltip>
          </div>
        </div>
      );
    } else {
      const url = `/cb/agent/quotes/${this.state.quote}/view`;
      return <Redirect to={url} />;
    }
  }
}
