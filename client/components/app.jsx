import React, { Component } from 'react';
import Header from './layout/header';
import DataTable from './dataTable';
import USMap from './maps/USMap';
import ReactTooltip from 'react-tooltip';
import abbrState from './stateHelper';
import { countryListObjByCode } from './countries';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      data2: [],
      dataView: [],
      USData: [],
      stateData: null,
      searchInput: '',
      showAll: false,
      countryCodeData: null,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleShowAllBtn = this.handleShowAllBtn.bind(this);
  }

  componentDidMount() {
    this.getData();
    this.getData2();
  }

  getData2() {
    fetch(`https://services1.arcgis.com/0MSEUqKaxRlEPj5g/ArcGIS/rest/services/Coronavirus_2019_nCoV_Cases/FeatureServer/1/query?where=1=1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=standard&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=deaths,Confirmed,Recovered,Country_Region&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=json&token=`)
      .then(res => res.json())
      .then(info => {
        const data2 = Object.entries(info).filter(val => val[0] === 'features')[0][1];
        console.log(data2);
        this.setState({ data2 });
      })
  }

  getData() {
    fetch(`http://covid19api.xapix.io/v2/locations`)
      .then(res => res.json())
      .then(info => {
        let data = Object.entries(info).shift()[1];
        data.sort((a, b) => b.latest.deaths - a.latest.deaths);
        const USData = data.filter(val => val.country_code === 'US').sort((a, b) => b.latest.deaths - a.latest.deaths);
        const USRegionsData = USData.filter(val => !val.province.includes(','));
        let stateData = {}, countries = [];
        for (let i = 0; i < USRegionsData.length; i++) {
          stateData[`US-${abbrState(USRegionsData[i].province, 'abbr')}`] = USRegionsData[i].latest.deaths
        }
        console.log(stateData);
        this.setState({ data, dataView: data, USData, stateData });
      })
      .catch(err => console.error(err));
  }

  handleShowAllBtn() {
    this.setState({ showAll: !this.state.showAll })
  }

  handleInputChange(e) {
    const name = e.target.name, value = e.target.value
    this.setState({ [name]: value })
  }

  handleSearchSubmit(e) {
    const { searchInput, showAll } = this.state;
    const keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      const copy = this.state.data.slice();
      const dataView = copy.filter((val, i) => {
        if (searchInput.toUpperCase() === 'US') return val.country === 'US';
        if (searchInput.length > 2) {
          if ((val.country.toLowerCase() === searchInput.toLowerCase())) return val.country.toLowerCase() === searchInput.toLowerCase();
          else return val.country.toLowerCase().includes(searchInput.toLowerCase());
        } else {
          return val.country_code.toLowerCase() === searchInput.toLowerCase();
        }
      });
      if (showAll) this.setState({ dataView, searchInput: '', showAll: false });
      else this.setState({ dataView, searchInput: '' });
    }
  }

  render() {
    const { data, dataView, searchInput, showAll, countryCodeData, USData, stateData } = this.state;
    if (data.length === 0) return <div>LOADING...</div>
    return (
      <>
        <Header />
        <main className="view-filter-container container-fluid">
          <h5>Region Selection</h5>
          <section className="row">
            <div className="col d-flex">
              <button className="btn world-view">World</button>
              <select name="countryView" id="country-views">
                {Object.entries(countryListObjByCode).map((val, i) => {
                  return (
                    <option key={i}>{val[1]}</option>
                  );
                })}
              </select>
            </div>
          </section>
        </main>
        <WorldMap stateData={stateData} countryCodeData={countryCodeData} USData={USData} data={data} />
        <main className="search-container container">
          <section className="row">
            <div className="col d-flex flex-column align-items-center">
              <h6 className="search-input-label">SEARCH BY COUNTRY OR COUNTRY CODE</h6>
              <div className="input-group mb-3 search-input">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">@</span>
                </div>
                <input name="searchInput" value={searchInput} onKeyPress={this.handleSearchSubmit} onChange={this.handleInputChange} type="text" className="form-control" placeholder="Country" aria-label="Country" aria-describedby="basic-addon1" />
              </div>
            </div>
          </section>
        </main>
        {showAll ? <DataTable handleShowAllBtn={this.handleShowAllBtn} data={data} /> : <DataTable handleShowAllBtn={this.handleShowAllBtn} data={dataView.length > 0 ? dataView : data} />}
      </>
    );
  }
}
