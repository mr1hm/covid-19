import React, { Component } from 'react';
import { VectorMap } from 'react-jvectormap';

export default class KoreaMap extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { data, USData, setTooltipContent, stateData } = this.props;
    const { regionClicked, stateColorData } = this.state;
    // if (!this.state.stateColorData) return <div>LOADING...</div>
    return (
      <main className="korea-map-container container-fluid">
        <small>*A brighter/lighter shade of red represents more COVID-19 infections in that region</small>
        <section className="row">
          <div className="col d-flex justify-content-center world-map-col">
            <VectorMap
              map={'kr_mill'}
              ref="map"
              backgroundColor='#0077be'
              zoomOnScroll={false}
              zoomStep={1.5}
              onRegionClick={this.handleRegionData}
              containerStyle={{ width: '100%', height: '600px' }}
              containerClassName={`world-map ${regionClicked ? 'regionClicked' : ''}`}
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
