import React, { Component } from "react";
import Icofont from "react-icofont";
import PropTypes from "prop-types";
import ScrollAnimation from "react-animate-on-scroll";

class Services extends Component {
  render() {
    //Service loop start
    const servicedata = this.props.servicesData.map((service, index) => (
      <div className="col-md-6 col-lg-4 text-center" key={index}>
        <div className="service-item">
          <div className="glyph">
            <Icofont icon={service.icon} />
          </div>
          <h3>{service.heading}</h3>
          <p>{service.description}</p>
        </div>
      </div>
    ));
    //Service loop END
    return (
      <React.Fragment>
        <section id="services" className="services ptb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 offset-lg-2 text-center">
                <ScrollAnimation animateIn="fadeInUp">
                  <div className="section-title">
                    <h2>{this.props.sectionTitle}</h2>
                    <h4>{this.props.sectionDescription}</h4>
                    <span className="section-title-bg">
                      {this.props.SectionbgTitle}
                    </span>
                  </div>
                </ScrollAnimation>
              </div>
            </div>
            <div className="row">{servicedata}</div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

//Props Types
Services.propTypes = {
  SectionbgTitle: PropTypes.string,
  sectionTitle: PropTypes.string,
  sectionDescription: PropTypes.string,
  servicesData: PropTypes.array
};

//Default Props
Services.defaultProps = {
  SectionbgTitle: "Agenti IATA",
  sectionTitle: "AGENTI IATA",
  sectionDescription:
    "CARGOBIDS è l'applicazione che rivoluziona e semplifica le modalità utilizzate dagli Agenti Iata nella richiesta e la gestione di  quotazioni tariffarie su base ad hoc o per traffici regolari.",

  servicesData: [
    {
      icon: "icofont-edit",
      heading: "Crea Inserzione",
      description:
        "Crea la tua richiesta di quotazione, inserendo i dettagli della spedizione ed il deadline richiesto per ricevere le risposte."
    },
    {
      icon: "icofont-listine-dots",
      heading: "Pubblica",
      description:
        "Ogni nuova richiesta di quotazione viene pubblicata anonimamente e visibile solamente ai Vettori aerei o GSA."
    },
    {
      icon: "icofont-euro",
      heading: "Ricevi Quotazioni",
      description:
        "Ricevi aggiornamenti delle quotazioni inviate in risposta alle tue inserzioni, direttamente tramite alerts visivi o email."
    },
    {
      icon: "icofont-chat",
      heading: "Contatta",
      description:
        "Se hai bisogno di ulteriori chiarimenti sulle quotazioni ricevute, contatta l'utente via Email o Chat."
    },
    {
      icon: "icofont-close-squared",
      heading: "Chiudi l'Inserzione",
      description:
        "Una volta selezionata la migliore offerta potrai chiudere la tua inserzione ."
    },
    {
      icon: "icofont-email",
      heading: "Invia Prenotazione",
      description:
        "Invia la richiesta di prenotazione direttamente al vettore selezionato tramite email."
    }
  ]
};

export default Services;
