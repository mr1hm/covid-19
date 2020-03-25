import React, { Component } from 'react';

export default class RegionData extends Component {
  constructor(props) {
    super(props);
  }

  handleClick() {

  }

  render() {
    const { regionData, countryData, handleRegionClick, handleCountryClick } = this.props;
    console.log(countryData);
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
    if (countryData) {
      return (
        <div className="col-4 d-flex flex-column region-data">
          <i onClick={() => {
            if (handleRegionClick) handleRegionClick();
            else handleCountryClick();
          }}
            className="fas fa-arrow-right close-region-data"></i>
          <hr />
          <h4>{countryData.countryName}</h4>
          <p><span className="infections">Infections</span>: {countryData.infected}</p>
          <p><span className="recovered">Recovered</span>: {countryData.recovered || countryData.recovered === 0 ? countryData.recovered : regionData.recovered}</p>
          <p><span className="deaths">Deaths</span>: {countryData.deaths || countryData.deaths === 0 ? countryData.deaths : regionData.deaths}</p>
        </div>
      );
    } else {
      return (
        <div className="col-4 d-flex flex-column region-data">
          <i onClick={() => {
            if (handleRegionClick) handleRegionClick();
            else handleCountryClick();
          }}
            className="fas fa-arrow-right close-region-data"></i>
          <hr />
          <h4>{regionData.regionName}</h4>
          <p><span className="infections">Infections</span>: {regionData.infected}</p>
          <p><span className="recovered">Recovered</span>: {regionData.recovered === 0 ? regionData.recovered : regionData.recovered}</p>
          <p><span className="deaths">Deaths</span>: {regionData.deaths === 0 ? regionData.deaths : regionData.deaths}</p>
        </div>
      );
    }
  }
}
