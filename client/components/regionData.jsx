import React, { Component } from 'react';

export default class RegionData extends Component {
  constructor(props) {
    super(props);
  }

  handleClick() {

  }

  render() {
    const { regionData, countryData, handleRegionClick, handleCountryClick } = this.props;
    if (!regionData && !countryData) {
      return (
        <div className="col-4 d-flex flex-column region-data">
          <i onClick={() => {
            if (handleRegionClick) handleRegionClick();
            else handleCountryClick();
          }}
            className="fas fa-arrow-right close-region-data"></i>
          <hr />
          <div>Please select a country or region to view data</div>
        </div>
      );
    }
    return (
      <div className="col-4 d-flex flex-column region-data">
        <i onClick={() => {
          if (handleRegionClick) handleRegionClick();
          else handleCountryClick();
        }}
          className="fas fa-arrow-right close-region-data"></i>
        <hr />
        <h4>{regionData.stateName}</h4>
        <p><span className="infections">Infections</span>: {regionData.infected}</p>
        <p><span className="recovered">Recovered</span>: {regionData.recovered}</p>
        <p><span className="deaths">Deaths</span>: {regionData.deaths}</p>
      </div>
    );
  }
}
