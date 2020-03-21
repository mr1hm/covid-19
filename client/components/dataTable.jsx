import React, { Component } from 'react';

export default class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  render() {
    const { data, dataView } = this.props;
    return (
      <main className="data-container container">
        <section className="row">
          <h5>INFECTIONS</h5>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Country Code</th>
                <th scope="col">Country</th>
                <th scope="col">Province</th>
                <th scope="col">Confirmed</th>
                <th scope="col">Recovered</th>
                <th scope="col">Death(s)</th>
              </tr>
            </thead>
            <tbody>
              {dataView.length === 0 ? data.map((val, i) => {
                return (
                  <tr key={i}>
                    <th scope="row">{val.country_code}</th>
                    <td>{val.country}</td>
                    <td>{val.province}</td>
                    <td>{val.latest.confirmed}</td>
                    <td>{val.latest.recovered}</td>
                    <td>{val.latest.deaths}</td>
                  </tr>
                );
              }) : dataView.map((val, i) => {
                return (
                  <tr key={i}>
                    <th scope="row">{val.country_code}</th>
                    <td>{val.country}</td>
                    <td>{val.province}</td>
                    <td>{val.latest.confirmed}</td>
                    <td>{val.latest.recovered}</td>
                    <td>{val.latest.deaths}</td>
                  </tr>
                );
              })
              }
            </tbody>
          </table>
        </section>
      </main>
    );
  }
}
