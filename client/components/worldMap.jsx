import React, { Component, memo } from 'react';
import { ComposableMap, ZoomableGroup, Geographies, Geography } from 'react-simple-maps';

class WorldMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setContent: '',
      content: '',
    };
    this.roundedPop = this.roundedPop.bind(this);
    this.filterData = this.filterData.bind(this);
    this.getPercentage = this.getPercentage.bind(this);
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

  filterData() {
    const { data } = this.props;

  }

  render() {
    const { data, setTooltipContent } = this.props;
    const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";
    return (
      <main className="world-map-container container">
        <section className="row">
          <div className="col d-flex justify-content-center">
            <ComposableMap data-tip="" projectionConfig={{ scale: 150 }} width={800} height={400} style={{ width: '100%', height: '100%', }}>
              <ZoomableGroup>
                <Geographies geography={geoUrl}>
                  {({ geographies }) => geographies.map(geo =>
                    <Geography onMouseEnter={() => {
                      let tooltip = '';
                      const { NAME, POP_EST, ISO_A2 } = geo.properties;
                      console.log(POP_EST);
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
