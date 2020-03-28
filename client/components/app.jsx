import React, { Component } from 'react';
import Header from './layout/header';
import News from './news';
import WorldMap from './maps/WorldMap';
import USMap from './maps/USMap';
import KoreaMap from './maps/KoreaMap';
import ReactTooltip from 'react-tooltip';
import abbrState from './stateHelper';
import { countryListObjByCode } from './countries';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataView: [],
      news: [],
      searchInput: '',
      showAll: false,
      countriesColorData: null,
      mapView: null,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleShowAllBtn = this.handleShowAllBtn.bind(this);
    this.handleMapViewChange = this.handleMapViewChange.bind(this);
  }

  componentDidMount() {
    this.getData();

  }

  getData() {
    const fetchCVData = fetch(`https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats`, {
      'method': 'GET',
      'headers': {
        "x-rapidapi-host": "covid-19-coronavirus-statistics.p.rapidapi.com",
        "x-rapidapi-key": "05b38be8cbmshd0a7f0f3b05745ep1665d5jsn393930b0712b"
      },
    })
    const fetchNews = fetch(`http://newsapi.org/v2/everything?q=coronavirus&sortBy=popularity&from=2020-03&apiKey=dd118ea81ac5402b932473468a0b8cdb`)
    Promise.all([fetchCVData, fetchNews])
      .then(res => Promise.all(res.map(response => response.json())))
      .then(results => {
        const data = results[0].data.covid19Stats;
        const news = results[1].articles;
        console.log(data);
        console.log(news);
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
              if (countryListObjByCode[key] === data[i].country) {
                data[i].country_code = key;
                countryCode = key;
              }
            }
          } else {
            data[i].country_code = data[i].country;
            data[i].view = 'USMap'
            countryCode = data[i].country;
          }
          if (countriesColorData[countryCode]) countriesColorData[countryCode] += data[i].confirmed;
          else countriesColorData[countryCode] = data[i].confirmed;
        }
        this.setState({ data, countriesColorData });
      })
  }

  handleShowAllBtn() {
    this.setState({ showAll: !this.state.showAll })
  }

  handleInputChange(e) {
    const name = e.target.name, value = e.target.value
    this.setState({ [name]: value })
  }

  handleMapViewChange(e, view) {
    const name = e.target.name, value = e.target.value;
    const mapObj = {
      'USMap': USMap,
      'WorldMap': WorldMap,
      'KoreaMap': KoreaMap,
      'ChinaMap': ChinaMap,
    }
    if (view) this.setState({ mapView: mapObj[view] });
    else this.setState({ [name]: value });
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
    const { data, dataView, countriesColorData, searchInput, showAll, mapView } = this.state;
    if (data.length === 0) return <div>LOADING...</div>
    return (
      <>
        <Header />
        <main className="view-filter-container container-fluid">
          <small>VIEW</small>
          <section className="row">
            <div className="col d-flex">
              <button onClick={e => this.handleMapViewChange(e, 'WorldMap')} className="btn world-view">World<i className="fas fa-globe-americas globe-icon"></i></button>
              {/* <select onChange={e => this.handleMapViewChange} name="mapView" id="country-views">
                {mapView === 'United States' ? abbrState('states', 'list').map((val, i) => <option key={i}>{val}</option>) : Object.entries(countryListObjByCode).map((val, i) => {
                  return (
                    <option key={i}>{val[1]}</option>
                  );
                })}
              </select> */}
            </div>
          </section>
        </main>
        {mapView ? React.createElement(mapView, { countriesColorData, data, handleMapViewChange: this.handleMapViewChange, }, null) : <WorldMap handleMapViewChange={this.handleMapViewChange} countriesColorData={countriesColorData} data={data} />}
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
