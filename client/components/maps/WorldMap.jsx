import React, { Component } from 'react';
import { VectorMap } from 'react-jvectormap';
import RegionData from '../regionData';
import { countryListObjByCode } from '../countries';

export default class WorldMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countryClicked: false,
      countryData: {
        countryName: '',
        infected: null,
        recovered: null,
        deaths: null,
      },
      countriesColorData: {},
    };
    this.handleCountryClick = this.handleCountryClick.bind(this);
    this.handleCountryData = this.handleCountryData.bind(this);
  }

  componentDidMount() {
    const sortedCountriesData = this.props.data.slice();
    sortedCountriesData.sort((a, b) => {
      let countryNameA = a.country.toUpperCase();
      let countryNameB = b.country.toUpperCase();
      if (countryNameA < countryNameB) return -1;
      if (countryNameA > countryNameB) return 1;
      return 0;
    });
    console.log(sortedCountriesData);
  }

  handleCountryClick() {
    this.setState({ countryClicked: false })
  }

  handleCountryData(e, countryCode) {
    this.refs.map.$mapObject.tip.hide();
    console.log(countryCode);
    this.setState({ countryClicked: true })
  }

  render() {
    const { countryData } = this.props;
    return (
      <main className="world-map-container container-fluid">
        <small>*A brighter/lighter shade of red represents more COVID-19 related deaths in that region</small>
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
                    values: countryData,
                    scale: ['#146804', '#ff0000'],
                    normalizeFunction: 'polynomial',
                  },
                ]
              }}
            />
          </div>
          {this.state.countryClicked ? <RegionData handleCountryClick={this.handleCountryClick} /> : null}
        </section>
      </main>
    );
  }
}
