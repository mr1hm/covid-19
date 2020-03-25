import React, { Component } from 'react';

export default class RegionData extends Component {
  constructor(props) {
    super(props);
  }

  handleClick() {

  }

  render() {
    const { regionData, handleRegionClick } = this.props;
    if (!regionData) {
      return (
        <div>Please select a state to view data</div>
      );
    }
    return (
      <div className="col-4 d-flex flex-column region-data">
        <i onClick={() => handleRegionClick()} className="fas fa-arrow-right close-region-data"></i>
        <hr />
        <h4>{regionData.stateName}</h4>
        <p><span className="infections">Infections</span>: {regionData.infected}</p>
        <p><span className="recovered">Recovered</span>: {regionData.recovered}</p>
        <p><span className="deaths">Deaths</span>: {regionData.deaths}</p>
      </div>
    );
  }
}
