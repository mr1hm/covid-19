import React, { Component } from 'react';
import Header from './layout/header';
import Tabs from './tabs';
import News from './news';
import WorldMap from './maps/WorldMap';
import USMap from './maps/USMap';
import KoreaMap from './maps/KoreaMap';
import abbrState from './lib/stateHelper';
import { countryListObjByCode } from './lib/countries';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      world: {
        confirmed: null,
        recovered: null,
        deaths: null,
      },
      data: [],
      dataView: [],
      news: {
        headlines: [],
        trending: [],
        health: [],
      },
      searchInput: '',
      showAll: false,
      countriesColorData: null,
      mapView: null,
      lastUpdated: '',
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
    const fetchNewsHeadlines = fetch(`http://newsapi.org/v2/top-headlines?country=us&apiKey=dd118ea81ac5402b932473468a0b8cdb`)
    const fetchNewsTrending = fetch(`https://newsapi.org/v2/everything?q=coronavirus&sortBy=popularity&apiKey=dd118ea81ac5402b932473468a0b8cdb`)
    const fetchNewsHealth = fetch(`http://newsapi.org/v2/top-headlines?category=health&country=us&apiKey=dd118ea81ac5402b932473468a0b8cdb`)
    Promise.all([fetchCVData, fetchNewsHeadlines, fetchNewsTrending, fetchNewsHealth])
      .then(res => Promise.all(res.map(response => response.json())))
      .then(results => {
        const lastUpdated = new Date(results[0].data.lastChecked);
        const data = results[0].data.covid19Stats;
        console.log(data);
        const worldConfirmed = data.reduce((acc, val) => acc + val.confirmed, 0);
        const worldRecovered = data.reduce((acc, val) => acc + val.recovered, 0);
        const worldDeaths = data.reduce((acc, val) => acc + val.deaths, 0);
        const headlines = results[1].articles;
        const trending = results[2].articles;
        const health = results[3].articles;
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
        this.setState(prevState => ({ data, world: { ...prevState.world, confirmed: worldConfirmed, recovered: worldRecovered, deaths: worldDeaths }, news: { ...prevState.news, headlines, trending, health }, countriesColorData, lastUpdated }));
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
    const { data, news, dataView, countriesColorData, searchInput, showAll, mapView, lastUpdated, world } = this.state;
    if (data.length === 0) return <div>LOADING...</div>
    return (
      <>
        <Header lastUpdated={lastUpdated.toString()} />
        <main className="view-filter-container container-fluid">
          {/* <section className="row">
            <div className="col d-flex flex-column align-items-center world-data">
              <h6>World Data</h6>
              <small>Infections: <strong style={{ color: 'purple' }}>{world.confirmed}</strong></small>
              <small>Recovered: <strong style={{ color: 'green' }}>{world.recovered}</strong></small>
              <small>Deaths: <strong style={{ color: 'red' }}>{world.deaths}</strong></small>
            </div>
          </section> */}
          <section className="row">
            <div className="col d-flex flex-column align-items-center view-filter">
              <h6>View</h6>
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
              <h5 className="related-news-label">RELATED NEWS</h5>
              <span className="newsAPI">Powered By NewsAPI</span>
              {/* <div className="input-group mb-3 search-input">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">@</span>
                </div>
                <input name="searchInput" value={searchInput} onKeyPress={this.handleSearchSubmit} onChange={this.handleInputChange} type="text" className="form-control" placeholder="Country" aria-label="Country" aria-describedby="basic-addon1" />
              </div> */}
            </div>
          </section>
        </main>
        <Tabs>
          <div label="Today's Headlines">
            <News news={news.headlines} />
          </div>
          <div filter={'popularity'} label="Trending">
            <News news={news.trending} />
          </div>
          <div label="Health">
            <News news={news.health} />
          </div>
        </Tabs>
        {/* {showAll ? <DataTable handleShowAllBtn={this.handleShowAllBtn} data={data} /> : <DataTable handleShowAllBtn={this.handleShowAllBtn} data={dataView.length > 0 ? dataView : data} />} */}
      </>
    );
  }
}
