import React, { Component } from 'react';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { lastUpdated, worldData } = this.props;
    return (
      <main className="header-container container-fluid">
        <section className="row">
          <div className="col d-flex flex-column align-items-center">
            <h5>COVID-19 Tracker</h5>
            <h6 className="text-center">World Data</h6>
            <small className="text-center">Infections: <strong>{worldData.confirmed}</strong> - Recovered: <strong>{worldData.recovered}</strong> - Deaths: <strong>{worldData.deaths}</strong></small>
            <small className="text-center">Last Updated: {lastUpdated.toString()}</small>
          </div>
        </section>
      </main>
    );
  }
}
