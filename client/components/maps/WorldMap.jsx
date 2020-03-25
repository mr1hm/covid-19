import React, { Component } from 'react';
import { VectorMap } from 'react-jvectormap';

export default class WorldMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      regionClicked: false,
    };
    this.handleRegionClick = this.handleRegionClick.bind(this);
  }

  countryData() {
    const { data } = this.props;
    // Add code to manipulate data by Country
    // If there are multiple datasets for the same country, reduce it to a sum of total confirmed, recovered, and deaths.
  }

  handleRegionClick(e, countryCode) {

  }

  render() {
    const { countryData } = this.props;
    return (
      <main className="world-map-container container-fluid">
        <small>*A brighter red represents more deaths in that region</small>
        <section className="row">
          <div className="col d-flex justify-content-center">
            <VectorMap
              map={'world_mill'}
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
              regionsSelectable={true}
              series={{
                regions: [
                  {
                    values: countryData,
                    scale: ['#146804', '#ff0000'],
                    normalizeFunction: 'polynomial',
                  },
                ]
              }}
            />
          </div>
        </section>
      </main>
    );
  }
}
