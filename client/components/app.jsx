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
      worldConfirmed: true,
      worldRecovered: true,
      worldDeaths: true,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleShowAllBtn = this.handleShowAllBtn.bind(this);
    this.handleMapViewChange = this.handleMapViewChange.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  compareLastUpdated(lastUpdated) {
    let time = lastUpdated.split(' ');
    fetch(`/api/lastUpdated`)
      .then(res => res.json())
      .then(dateAndTime => {
        console.log(dateAndTime)
        const prevTimestamp = +dateAndTime.datetime;
        const currentTimestamp = new Date(formatDate(lastUpdated).replace(' ', 'T') + 'Z').getTime() / 1000;
        console.log(prevTimestamp, currentTimestamp)
        if (currentTimestamp > prevTimestamp) {
          if (currentTimestamp === prevTimestamp) return; // THIS IS NOT WORKING - NEED TO FIND A WAY TO COMPARE PREV TIMSTAMP TO CURRENT TIMSTAMP AND ONLY INSERT IF IT'S DIFFERENT.
          console.log('storing new timestamp')
          const timestamp = { unixTimestamp: currentTimestamp }
          fetch(`/api/lastUpdated`, {
            method: 'POST',
            body: JSON.stringify(timestamp),
            headers: {
              'Content-Type': 'application/json'
            }
          })
            .then(res => res.json())
            .then(storedTimestamp => console.log(storedTimestamp))
            .catch(err => console.error(err));
        }
      })
      .catch(err => console.error(err));

    function formatDate(date) {
      var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2)
        month = '0' + month;
      if (day.length < 2)
        day = '0' + day;

      return `${[year, month, day].join('-')} ${time[time.length - 1]}`;
    }
  }

  getData() {
    const fetchCVData = fetch(`https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats`, {
      'method': 'GET',
      'headers': {
        "x-rapidapi-host": "covid-19-coronavirus-statistics.p.rapidapi.com",
        "x-rapidapi-key": "05b38be8cbmshd0a7f0f3b05745ep1665d5jsn393930b0712b"
      },
    })
    const fetchNewsHeadlines = fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=dd118ea81ac5402b932473468a0b8cdb`)
    const fetchNewsTrending = fetch(`https://newsapi.org/v2/everything?q=coronavirus&sortBy=popularity&apiKey=dd118ea81ac5402b932473468a0b8cdb`)
    const fetchNewsHealth = fetch(`https://newsapi.org/v2/top-headlines?category=health&country=us&apiKey=dd118ea81ac5402b932473468a0b8cdb`)
    Promise.all([fetchCVData, fetchNewsHeadlines, fetchNewsTrending, fetchNewsHealth])
      .then(res => Promise.all(res.map(response => response.json())))
      .then(results => {
        const lastUpdated = new Date(results[0].data.lastChecked).toString();
        const lastUpdatedArr = lastUpdated.split(' ');
        const dateAndTime = `${lastUpdatedArr[0]} ${lastUpdatedArr[1]} ${lastUpdatedArr[2]}, ${lastUpdatedArr[3]} ${lastUpdatedArr[4]}`;
        console.log(dateAndTime);
        this.compareLastUpdated(dateAndTime);
        const data = results[0].data.covid19Stats;
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
    console.log(news);
    if (data.length === 0) return <div>LOADING...</div>
    if (!news) return null;
    return (
      <>
        <Header />
        <main className="view-filter-container container-fluid">
          <section className="row">
            <div className="col d-flex flex-column align-items-center">
              <h6 className="view-filter">View</h6>
              <small className="world-view"><a onClick={e => this.handleMapViewChange(e, 'WorldMap')}>World<i className="fas fa-globe-americas globe-icon"></i></a></small>
              <small className="usa-view"><a onClick={e => this.handleMapViewChange(e, 'USMap')}>USA<i className="fas fa-flag-usa usa-flag-icon"></i></a></small>
            </div>
            <div className="col d-flex flex-column align-items-center">
              <h6 className="last-updated">Last Updated</h6>
              <small className="text-center">{lastUpdated.toString()}</small>
            </div>
            <div className="col d-flex flex-column align-items-center">
              <h6 className="world-data">World Data</h6>
              <small>Infections: <strong style={{ color: 'purple' }}>{world.confirmed}</strong></small>
              <small>Recovered: <strong style={{ color: 'green' }}>{world.recovered}</strong></small>
              <small>Deaths: <strong style={{ color: 'red' }}>{world.deaths}</strong></small>
            </div>
          </section>
        </main>
        {mapView ? React.createElement(mapView, { countriesColorData, data, handleMapViewChange: this.handleMapViewChange, }, null) : <WorldMap handleMapViewChange={this.handleMapViewChange} countriesColorData={countriesColorData} data={data} />}
        <main className="search-container container">
          <section className="row">
            <div className="col d-flex flex-column align-items-center">
              <h5 className="related-news-label">RELATED NEWS</h5>
              <span className="newsAPI">Powered By NewsAPI</span>
            </div>
          </section>
        </main>
        <Tabs>
          <div label="Today's Headlines">
            <News news={news.headlines} />
          </div>
          <div label="Trending">
            <News trending={true} news={news.trending} />
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
