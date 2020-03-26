import React, { Component } from 'react';
import { VectorMap } from 'react-jvectormap';
import RegionData from '../regionData';
import { countryListObjByCode, countryListISOData, getCountryCode, findCountry } from '../countries';

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
    const countryArr = this.props.data.filter(val => getCountryCode(val.country) === countryCode);
    const totalInfected = countryArr.reduce((acc, val) => acc + val.confirmed, 0);
    const totalRecovered = countryArr.reduce((acc, val) => acc + val.recovered, 0);
    const totalDeaths = countryArr.reduce((acc, val) => acc + val.deaths, 0);
    const countryName = countryListObjByCode[countryCode];
    this.setState(prevState =>
      ({
        countryData: { ...prevState.countryData, countryName, infected: totalInfected, recovered: totalRecovered, deaths: totalDeaths },
        countryClicked: true
      })
    )
  }

  render() {
    const { countryData, countriesData } = this.state;
    const { countriesColorData } = this.props;
    return (
      <main className="world-map-container container-fluid">
        <small>*A brighter/lighter shade of red represents more COVID-19 infections in that region</small>
        <section className="row">
          <div className="col d-flex justify-content-center">
            <VectorMap
              map={'world_mill'}
              ref="map"
              backgroundColor='#0077be'
              zoomOnScroll={false}
              zoomStep={1.5}
              onRegionClick={this.handleCountryData}
              containerStyle={{ width: '100%', height: '600px' }}
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
                    scale: ['#146804', '#ff0000'],
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
