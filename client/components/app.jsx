import React, { Component } from 'react';
import Header from './layout/header';
import DataTable from './dataTable';
import USMap from './maps/USMap';
import WorldMap from './maps/WorldMap';
import ReactTooltip from 'react-tooltip';
import abbrState from './stateHelper';
import { countryListObjByCode } from './countries';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataView: [],
      stateData: null,
      searchInput: '',
      showAll: false,
      countriesColorData: null,
      mapView: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleShowAllBtn = this.handleShowAllBtn.bind(this);
    this.handleMapViewChange = this.handleMapViewChange.bind(this);
  }

  componentDidMount() {
    // this.getData();
    this.getData2();
  }

  getData2() {
    // TESTING ONLY RIGHT NOW
    fetch(`https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats`, {
      'method': 'GET',
      'headers': {
        "x-rapidapi-host": "covid-19-coronavirus-statistics.p.rapidapi.com",
        "x-rapidapi-key": "05b38be8cbmshd0a7f0f3b05745ep1665d5jsn393930b0712b"
      },
    })
      .then(res => res.json())
      .then(info => {
        const data = Object.entries(info)[3][1].covid19Stats;
        data.sort((a, b) => {
          let countryNameA = a.country.toUpperCase();
          let countryNameB = b.country.toUpperCase();
          if (countryNameA < countryNameB) return -1;
          if (countryNameA > countryNameB) return 1;
          return 0;
        });
        let countriesColorData = {}, countryCode;
        for (let i = 0; i < data.length; i++) {
          if (data[i].country !== 'US') {
            for (const key in countryListObjByCode) {
              if (countryListObjByCode[key] === data[i].country) countryCode = key;
            }
          } else {
            countryCode = data[i].country
          }
          if (countriesColorData[countryCode]) countriesColorData[countryCode] += data[i].confirmed;
          else countriesColorData[countryCode] = data[i].confirmed;
        }
        this.setState({ data, countriesColorData });
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

  handleMapViewChange(e) {
    const name = e.target.name, value = e.target.value;
    this.setState({ [name]: value });
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
    const { data, dataView, countriesColorData, searchInput, showAll, countryCodeData, USData, stateData, mapView } = this.state;
    if (data.length === 0) return <div>LOADING...</div>
    return (
      <>
        <Header />
        <main className="view-filter-container container-fluid">
          <h5>Country Selection</h5>
          <section className="row">
            <div className="col d-flex">
              <button className="btn world-view">World</button>
              <select onChange={this.handleMapViewChange} name="mapView" id="country-views">
                {Object.entries(countryListObjByCode).map((val, i) => {
                  return (
                    <option key={i}>{val[1]}</option>
                  );
                })}
              </select>
            </div>
          </section>
        </main>
        {mapView === 'United States' ? <USMap stateData={stateData} countryCodeData={countryCodeData} data={data} /> : <WorldMap countriesColorData={countriesColorData} data={data} />}
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
