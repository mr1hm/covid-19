import React, { Component, memo } from 'react';
import { ComposableMap, ZoomableGroup, Geographies, Geography, Marker, Annotation } from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';
import allStates from './data/allStates.json';
import abbrState from './stateHelper';
import RegionData from './regionData';
import { VectorMap } from 'react-jvectormap';

class WorldMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // map: 'world_mill',
      center: [0, 0],
      zoom: 1,
      currentCountry: null,
      regionClicked: false,
      regionData: {
        stateName: '',
        infected: null,
        recovered: null,
        deaths: null,
      },
    };
    this.roundedPop = this.roundedPop.bind(this);
    this.getPercentage = this.getPercentage.bind(this);
    this.handleRegionClick = this.handleRegionClick.bind(this);
  }

  roundedPop(num) {
    if (num > 1000000000) {
      return Math.round(num / 100000000) / 10 + 'Bn';
    } else if (num > 1000000) {
      return Math.round(num / 100000) / 10 + 'M';
    } else {
      return Math.round(num / 100) / 10 + 'K';
    }
  }

  getPercentage(num) {
    if (num > 1000000000) {
      return Math.round(num / 100000000) / 10 + '%';
    } else if (num > 1000000) {
      return Math.round(num / 100000) / 10 + '%';
    } else {
      return Math.round(num / 100) / 10 + '%';
    }
  }

  handleRegionClick(e, countryRegionCode) {
    this.refs.map.$mapObject.tip.hide();
    const stateName = abbrState(countryRegionCode.split('-')[1], 'name');
    // const countryCode = countryRegionCode.split('-')[1];
    const state = this.props.USData.filter(val => val.province === stateName);
    const totalInfected = state[0].latest.confirmed;
    const totalRecovered = state[0].latest.recovered;
    const totalDeaths = state[0].latest.deaths;
    this.setState(prevState => ({ regionClicked: true, regionData: { ...prevState.regionData, stateName, infected: totalInfected, recovered: totalRecovered, deaths: totalDeaths } }))
  }

  render() {
    const { data, USData, setTooltipContent, countryCodeData, stateData } = this.props;
    return (
      <main className="world-map-container container-fluid">
        <section className="row">
          <div className="col d-flex justify-content-center world-map-col">
            <VectorMap
              map={this.state.map || 'us_aea'}
              ref="map"
              backgroundColor='#0077be'
              zoomOnScroll={false}
              zoomStep={1.5}
              onRegionClick={this.handleRegionClick}
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
                    }[code.split('-')[1]];
                  }
                }
              }}
              regionsSelectable={true}
              series={{
                regions: [
                  {
                    values: countryCodeData,
                    scale: ['#146804', '#ff0000'],
                    normalizeFunction: 'polynomial',
                  }
                ]
              }}
            />
          </div>
          {this.state.regionClicked ? <RegionData regionData={this.state.regionData} /> : null}
        </section>
      </main >
    );
  }
}

export default memo(WorldMap);
