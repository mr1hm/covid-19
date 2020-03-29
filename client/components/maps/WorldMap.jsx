import React, { Component } from 'react';
import { VectorMap } from 'react-jvectormap';
import RegionData from '../regionData';
import { countryListObjByCode, countryListISOData, getCountryCode, findCountry } from '../lib/countries';

export default class WorldMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countryClicked: false,
      countryData: {
        countryName: '',
        lastUpdated: null,
        infected: null,
        recovered: null,
        deaths: null,
        view: '',
      },
      countriesData: {},
    };
    this.handleCountryClick = this.handleCountryClick.bind(this);
    this.handleCountryData = this.handleCountryData.bind(this);
  }

  handleCountryClick() {
    this.setState({ countryClicked: false })
  }

  // checkIfCountryExistsInData(countryName) { // TEST PURPOSES ONLY
  //   let temp = `Mali`
  //   const filtered = sortedCountriesData.filter(val => val.country.includes(temp));
  //   console.log(filtered);
  //   console.log(findCountry(temp));
  // }

  handleCountryData(e, countryCode) {
    this.refs.map.$mapObject.tip.hide();
    const countryArr = this.props.data.filter(val => val.country_code === countryCode);
    let lastUpdated, totalInfected, totalRecovered, totalDeaths, view, countryName = countryListObjByCode[countryCode];
    if (countryArr.length >= 1) {
      lastUpdated = countryArr[0].lastUpdate;
      totalInfected = countryArr.reduce((acc, val) => acc + val.confirmed, 0);
      totalRecovered = countryArr.reduce((acc, val) => acc + val.recovered, 0);
      totalDeaths = countryArr.reduce((acc, val) => acc + val.deaths, 0);
      if (countryArr[0]) {
        switch (countryArr[0].country_code) {
          case 'US':
            view = `USMap`;
            break;
          case 'KR':
            view = `KoreaMap`;
            break;
        }
      }
    } else {
      lastUpdated = `This country currently has no data available`;
      totalInfected = `NA`;
      totalRecovered = `NA`;
      totalDeaths = `NA`;
      view = `NA`;
    }
    this.setState(prevState =>
      ({
        countryData: { ...prevState.countryData, countryName, lastUpdated, infected: totalInfected, recovered: totalRecovered, deaths: totalDeaths, view },
        countryClicked: true
      })
    )
  }

  render() {
    const { countryData, countriesData } = this.state;
    const { countriesColorData } = this.props;
    return (
      <main className="world-map-container container-fluid">
        <small className="map-color-key">
          <span className="map-color-key-less">Less</span>
          <i className="fas fa-circle"></i>
          <i className="fas fa-circle"></i>
          <i className="fas fa-circle"></i>
          <i className="fas fa-circle"></i>
          <i className="fas fa-circle"></i>
          <i className="fas fa-circle"></i>
          <i className="fas fa-circle"></i>
        </small>
        <section className="row">
          <div className="col d-flex justify-content-center">
            <VectorMap
              map={'world_mill'}
              ref="map"
              backgroundColor='#0077be'
              zoomOnScroll={false}
              zoomStep={1.5}
              onRegionClick={this.handleCountryData}
              containerStyle={{ width: '100%', height: '650px' }}
              containerClassName={`world-map ${this.state.regionClicked ? 'regionClicked' : ''}`}
              regionStyle={{
                initial: {
                  fill: '#e4e4e4',
                  'fill-opacity': 0.9,
                  stroke: 'none',
                  'stroke-width': 0,
                  'stroke-opacity': 0,
                },
                hover: {
                  'fill-opacity': 0.8,
                  cursor: 'pointer',
                },
                selected: {
                  fill: '#2938bc',
                },
                selectedHover: {}
              }}
              regionLabelStyle={{
                initial: {
                  'font-family': 'Poppins',
                  'font-size': '12',
                  'font-weight': 'bold',
                  cursor: 'default',
                  fill: 'black',
                },
                hover: {
                  'fill-opacity': 0.8,
                  cursor: 'pointer',
                },
                selected: {
                  fill: '#2938bc',
                },
                selectedHover: {}
              }}
              regionsSelectable={true}
              series={{
                regions: [
                  {
                    values: countriesColorData,
                    scale: ['#ffe5e5', '#4d0000'],
                    normalizeFunction: 'polynomial',
                  },
                ]
              }}
            />
          </div>
          {this.state.countryClicked ? <RegionData handleMapViewChange={this.props.handleMapViewChange} countryData={countryData} handleCountryClick={this.handleCountryClick} /> : null}
        </section>
      </main>
    );
  }
}
