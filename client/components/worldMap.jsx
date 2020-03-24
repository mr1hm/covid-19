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
    console.log(this.refs.map.getMapObject());
    const state = this.props.USData.filter(val => val.province === stateName);
    console.log(state);
    const totalInfected = state[0].latest.confirmed;
    const totalRecovered = state[0].latest.recovered;
    const totalDeaths = state[0].latest.deaths;
    this.setState(prevState => ({ regionClicked: true, regionData: { ...prevState.regionData, stateName, infected: totalInfected, recovered: totalRecovered, deaths: totalDeaths } }))
  }

  render() {
    const { data, USData, setTooltipContent, countryCodeData } = this.props;
    return (
      <main className="world-map-container container-fluid">
        <section className="row">
          <div className="col d-flex justify-content-center world-map-col">
            <VectorMap
              map={this.state.map || 'us_aea'}
              ref="map"
              backgroundColor='#0077be'
              zoomOnScroll={false}

              onRegionClick={this.handleRegionClick}
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
            {/* <ComposableMap data-tip="" projectionConfig={{ scale: 150 }} width={800} height={400} style={{ width: '100%', height: '100%', }}>
              <ZoomableGroup center={this.state.center} zoom={this.state.zoom}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) => geographies.map(geo =>
                    <Geography onMouseEnter={() => {
                      let tooltip = '';
                      const { NAME, POP_EST, ISO_A2 } = geo.properties;
                      const confirmed = data.filter(val => val.country_code === ISO_A2);
                      let totalInfected, totalRecovered, totalDeaths;
                      if (confirmed.length > 1) {
                        totalInfected = confirmed.reduce((acc, val) => acc + val.latest.confirmed, 0);
                        totalRecovered = confirmed.reduce((acc, val) => acc + val.latest.recovered, 0);
                        totalDeaths = confirmed.reduce((acc, val) => acc + val.latest.deaths, 0);
                      } else if (confirmed.length === 1) {
                        totalInfected = confirmed[0].latest.confirmed;
                        totalRecovered = confirmed[0].latest.recovered;
                        totalDeaths = confirmed[0].latest.deaths;
                      } else {
                        totalInfected = `0`
                        totalRecovered = `0`
                        totalDeaths = `0`
                      }
                      tooltip = `${NAME} - ${this.roundedPop(POP_EST)} - INFECTED: ${totalInfected} [ ${this.getPercentage(totalInfected)} ] - RECOVERED: ${totalRecovered} - DEATHS: ${totalDeaths}`;
                      setTooltipContent(tooltip);
                    }}
                      onMouseLeave={() => setTooltipContent('')}
                      style={{
                        default: {
                          fill: '#D6D6DA',
                          outline: 'none',
                        },
                        hover: {
                          fill: '#F53',
                          oultine: 'none',
                        },
                        pressed: {
                          fill: '#E42',
                          outline: 'none',
                        }
                      }}
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={this.handleGeographyClick} />
                  )}
                </Geographies>
              </ZoomableGroup>
            </ComposableMap> */}
          </div>
        </section>
      </main>
    );
  }
}

export default WorldMap;
