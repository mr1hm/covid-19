import React, { Component } from 'react';

export default class RegionData extends Component {
  constructor(props) {
    super(props);
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
    if (countryData) {
      console.log(countryData);
      return (
        <div className="col-4 d-flex flex-column region-data">
          <i onClick={() => {
            if (handleRegionClick) handleRegionClick();
            else handleCountryClick();
          }}
            className="fas fa-arrow-right close-region-data"><span style={{ fontFamily: 'Poppins', fontWeight: 'normal', fontSize: '0.9rem' }}> Close</span></i>
          <hr />
          <h4>{countryData.countryName}</h4>
          <small>Last Updated: {countryData.lastUpdated ? countryData.lastUpdated : `This country currently has no data available`}</small>
          <small onClick={(e) => this.props.handleMapViewChange(e, countryData.view)} className="btn country-title-btn"><a><i className="fas fa-map-marked-alt show-map-icon"></i><small>Show Map</small></a></small>
          <p><span className="infections">Infections</span>: {countryData.infected} <i className="fas fa-long-arrow-alt-up"></i></p>
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
            className="fas fa-arrow-right close-region-data"><span style={{ fontFamily: 'Poppins', fontWeight: 'normal', fontSize: '0.9rem' }}> Close</span></i>
          <hr />
          <h4>{regionData.regionName}</h4>
          <small className="province-last-updated">Last Updated: {regionData.lastUpdated ? regionData.lastUpdated : `This province currently has no data available`}</small>
          <p><span className="infections">Infections</span>: {regionData.infected}</p>
          <p><span className="recovered">Recovered</span>: {regionData.recovered === 0 ? regionData.recovered : regionData.recovered}</p>
          <p><span className="deaths">Deaths</span>: {regionData.deaths === 0 ? regionData.deaths : regionData.deaths}</p>
        </div>
      );
    }
  }
}
