import React, { Component } from 'react';

export default class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  render() {
    const { data, dataView, handleShowAllBtn } = this.props;
    return (
      <main className="data-container container">
        <section className="row">
          <h5>INFECTIONS</h5>
          <button onClick={() => handleShowAllBtn()} className="show-all-btn">Show All</button>
          <table className="table data-table">
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
              {data.map((val, i) => {
                return (
                  <tr key={i}>
                    <td scope="row">{val.country_code}</td>
                    <td>{val.country}</td>
                    <td>{val.province}</td>
                    <td>{val.confirmed}</td>
                    <td>{val.recovered}</td>
                    <td>{val.deaths}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </main>
    );
  }
}
