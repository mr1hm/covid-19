import React, { Component, memo } from 'react';
import { ComposableMap, ZoomableGroup, Geographies, Geography } from 'react-simple-maps';
import { VectorMap } from 'react-jvectormap';

class WorldMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: [0, 0],
      zoom: 1,
      currentCountry: null,
    };
    this.roundedPop = this.roundedPop.bind(this);
    this.getPercentage = this.getPercentage.bind(this);
    this.handleGeographyClick = this.handleGeographyClick.bind(this);
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

  handleRegionClick(e, countryCode) {
    console.log(countryCode);
  }

  projection() {
    return geoTimes().translate([800 / 2, 400 / 2]).scale(160);
  }

  handleGeographyClick(geography) {
    console.log(geography);
    const path = geoPath().projection(this.projection());
    const centroid = this.projection().invert(path.centroid(geography));
    this.setState({ center: centroid, zoom: 4, currentCountry: geography.properties.iso_a3 });
  }

  render() {
    const { data, setTooltipContent, countryCodeData } = this.props;
    const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";
    return (
      <main className="world-map-container container">
        <section className="row">
          <div className="col d-flex justify-content-center">
            <VectorMap
              map={`world_mill`}
              backgroundColor='#0077be'
              zoomOnScroll={true}
              containerStyle={{ width: '100%', height: '520px' }}
              onRegionClick={this.handleRegionClick}
              containerClassName="world-map"
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
                      geography={geo} />
                  )}
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </div>
        </section>
      </main>
    );
  }
}

export default memo(WorldMap);
