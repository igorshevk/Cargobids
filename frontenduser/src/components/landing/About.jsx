import React, { Component } from "react";
import PropTypes from "prop-types";
import Icofont from "react-icofont";
import ScrollAnimation from "react-animate-on-scroll";

class About extends Component {
  render() {
    //About loop start
    const aboutdata = this.props.aboutsData.map((about, index) => (
      <div className="col-lg-4 col-md-6 text-center" key={index}>
        <div className="about-info">
          <Icofont icon={about.Icon} />
          <h3>{about.title}</h3>
          <p>{about.content}</p>
        </div>
      </div>
    ));
    //About loop END
    return (
      <React.Fragment>
        <section id="about" className="about-us ptb-100">
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

            <div className="row">{aboutdata}</div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}
//Props Types
About.propTypes = {
  SectionbgTitle: PropTypes.string,
  sectionTitle: PropTypes.string,
  sectionDescription: PropTypes.string,
  aboutsData: PropTypes.array
};

//Default Props
About.defaultProps = {
  SectionbgTitle: "Vettori & GSA",
  sectionTitle: "VETTORI AEREI & GSA",
  sectionDescription:
    "L'utilizzo dell'applicazione CARGOBIDS permette ai rappresentanti dei Vettori e/o GSA di accedere, filtrare e selezionare tutte le richieste di quotazione dal mercato, monitorando la competitività delle proprie quotazioni ed adeguando eventualmente la propria offerta in base alle altre proposte.",
  aboutsData: [
    {
      Icon: "icofont-binoculars",
      title: "Ricerca/Filtra Inserzioni",
      content:
        "Seleziona tra tutte le inserzioni pubblicate, quelle che più ti interessano in base all'area geografica o destinazione."
    },
    {
      Icon: "icofont-question-circle",
      title: "Maggiori Informazioni",
      content:
        "Nel caso avessi bisogno di maggiori dettagli, puoi inviare una domanda direttamente all'inserzionista."
    },
    {
      Icon: "icofont-money",
      title: "Fai la tua proposta!",
      content:
        "Rispondi alle inserzioni inviando la tua migliore proposta tariffaria, specificandone le condizioni di validità."
    },
    {
      Icon: "icofont-company",
      title: "Confidenzialitá",
      content:
        "I dettagli delle tue proposte tariffarie sono assolutamente riservati in quanto visibili solamente all'agente inserzionista."
    },
    {
      Icon: "icofont-dashboard-web",
      title: "Le Mie Proposte",
      content:
        "Hai a disposizione un pannello di controllo personalizzato per tenere sotto controllo tutte le tue quotazioni già inviate."
    },
    {
      Icon: "icofont-handshake-deal",
      title: "Finalizzazione",
      content:
        "La migliore offerta selezionata dall'agente inserzionista, verrà finalizzata tramite prenotazione inviata via Email."
    }
  ]
};

export default About;
