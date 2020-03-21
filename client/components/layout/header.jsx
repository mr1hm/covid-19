import React, { Component } from 'react';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <main className="header-container container-fluid">
        <section className="row">
          <div className="col d-flex justify-content-center">
            <h5>COVID-19 Tracker</h5>
          </div>
        </section>
      </main>
    );
  }
}
