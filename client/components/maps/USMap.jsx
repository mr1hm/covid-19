import React, { Component, memo } from 'react';
import { geoCentroid } from 'd3-geo';
import abbrState from '../lib/stateHelper';
import RegionData from '../regionData';
import { VectorMap } from 'react-jvectormap';

export default class USMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stateColorData: {},
      currentCountry: null,
      regionClicked: false,
      regionData: {
        regionName: '',
        lastUpdated: null,
        infected: null,
        recovered: null,
        deaths: null,
      },
    };
    // this.roundedPop = this.roundedPop.bind(this);
    // this.getPercentage = this.getPercentage.bind(this);
    this.handleRegionData = this.handleRegionData.bind(this);
    this.handleRegionClick = this.handleRegionClick.bind(this);
  }

  componentDidMount() {
    this.setUSData();
  }

  setUSData() {
    const { data } = this.props;
    const filteredUSData = data.filter(val => val.country === 'US');
    let stateColorData = {};
    for (let i = 0; i < filteredUSData.length; i++) {
      const stateName = `US-${abbrState(filteredUSData[i].province, 'abbr')}`;
      if (stateColorData[stateName]) stateColorData[stateName] += filteredUSData[i].confirmed;
      else stateColorData[stateName] = filteredUSData[i].confirmed;
    }
    this.setState({ stateColorData });
  }

  // roundedPop(num) {
  //   if (num > 1000000000) {
  //     return Math.round(num / 100000000) / 10 + 'Bn';
  //   } else if (num > 1000000) {
  //     return Math.round(num / 100000) / 10 + 'M';
  //   } else {
  //     return Math.round(num / 100) / 10 + 'K';
  //   }
  // }

  // getPercentage(num) {
  //   if (num > 1000000000) {
  //     return Math.round(num / 100000000) / 10 + '%';
  //   } else if (num > 1000000) {
  //     return Math.round(num / 100000) / 10 + '%';
  //   } else {
  //     return Math.round(num / 100) / 10 + '%';
  //   }
  // }

  handleRegionClick() {
    this.setState({ regionClicked: false })
  }

  handleRegionData(e, countryRegionCode) {
    this.refs.map.$mapObject.tip.hide();
    const regionName = abbrState(countryRegionCode.split('-')[1], 'name');
    const state = this.props.data.filter(val => val.province === regionName);
    const lastUpdated = state[0].lastUpdate;
    const totalInfected = state.reduce((acc, val) => acc + val.confirmed, 0);
    const totalRecovered = state.reduce((acc, val) => acc + val.recovered, 0);
    const totalDeaths = state.reduce((acc, val) => acc + val.deaths, 0);
    this.setState(prevState => ({
      regionClicked: true,
      regionData: { ...prevState.regionData, regionName, lastUpdated, infected: totalInfected, recovered: totalRecovered, deaths: totalDeaths }
    }));
  }

  render() {
    const { data } = this.props;
    const { regionClicked, stateColorData } = this.state;
    // if (!this.state.stateColorData) return <div>LOADING...</div>
    return (
      <main className="usa-map-container container-fluid">
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
          <div className="col d-flex justify-content-center world-map-col">
            <VectorMap
              map={'us_aea'}
              ref="map"
              backgroundColor='#0077be'
              zoomOnScroll={false}
              zoomStep={1.5}
              onRegionClick={this.handleRegionData}
              containerStyle={{ width: '100%', height: '600px' }}
              containerClassName={`us-map ${regionClicked ? 'regionClicked' : ''}`}
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
              labels={{
                regions: {
                  render: code => {
                    return code.split('-')[1];
                  },
                  offsets: code => {
                    return {
                      'CA': [-10, 10],
                      'ID': [0, 40],
                      'OK': [25, 0],
                      'LA': [-20, 0],
                      'FL': [45, 0],
                      'KY': [10, 5],
                      'VA': [15, 5],
                      'MI': [30, 30],
                      'AK': [50, -25],
                      'HI': [25, 60],
                      'MN': [-15, 10],
                      'NV': [0, -10],
                      'WV': [-8, 5],
                      'VT': [0, -5],
                      'NH': [-3, 10],
                      'CT': [0, -4],
                      'MD': [0, -7],
                      'TX': [10, 0],
                      'NJ': [3, 0],
                    }[code.split('-')[1]];
                  }
                }
              }}
              regionsSelectable={true}
              series={{
                regions: [
                  {
                    values: stateColorData,
                    scale: ['#146804', '#ff0000'],
                    normalizeFunction: 'polynomial',
                  }
                ]
              }}
            />
          </div>
          {this.state.regionClicked ? <RegionData handleRegionClick={this.handleRegionClick} regionData={this.state.regionData} /> : null}
        </section>
      </main >
    );
  }
}
