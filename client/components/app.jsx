import React, { Component } from 'react';
import Header from './layout/header';
import Tabs from './tabs';
// import News from './news';
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
    this.handleShowAllBtn = this.handleShowAllBtn.bind(this);
    this.handleMapViewChange = this.handleMapViewChange.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  compareLastUpdated(lastUpdated, worldData) {
    let time = lastUpdated.split(' ');
    let increased = false;
    fetch(`/api/lastUpdated`)
      .then(res => res.json())
      .then(prevDateAndTime => {
        console.log(prevDateAndTime, worldData)
        if (worldData.worldConfirmed >= prevDateAndTime.infections) {
          this.setState({ worldConfirmed: true })
          increased = true;
        } else {
          this.setState({ worldConfirmed: 'less' })
        }
        if (worldData.worldRecovered >= prevDateAndTime.recovered) {
          this.setState({ worldRecovered: true })
          increased = true;
        } else {
          this.setState({ worldRecovered: 'less' })
        }
        if (worldData.worldDeaths >= prevDateAndTime.deaths) {
          this.setState({ worldDeaths: true })
          increased = true;
        } else {
          this.setState({ worldDeaths: 'less' })
        }
        const prevTimestamp = +prevDateAndTime.datetime;
        const currentTimestamp = new Date(formatDate(lastUpdated).replace(' ', 'T') + 'Z').getTime() / 1000;
        console.log(prevTimestamp, currentTimestamp)
        if (currentTimestamp > prevTimestamp) {
          console.log('storing new timestamp')
          const data = { unixTimestamp: currentTimestamp, infections: worldData.worldConfirmed, recovered: worldData.worldRecovered, deaths: worldData.worldDeaths, increased }
          fetch(`/api/lastUpdated`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json'
            }
          })
            .then(res => res.json())
            .then(storedData => {
              console.log(storedData);
            })
            .catch(err => console.error(err));
        } else {

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
    // const fetchNewsHeadlines = fetch(`https://cors-anywhere.herokuapp.com/https://newsapi.org/v2/top-headlines?country=us&apiKey=dd118ea81ac5402b932473468a0b8cdb`)
    // const fetchNewsTrending = fetch(`https://cors-anywhere.herokuapp.com/https://newsapi.org/v2/everything?q=coronavirus&sortBy=popularity&apiKey=dd118ea81ac5402b932473468a0b8cdb`)
    // const fetchNewsHealth = fetch(`https://cors-anywhere.herokuapp.com/https://newsapi.org/v2/top-headlines?category=health&country=us&apiKey=dd118ea81ac5402b932473468a0b8cdb`)
    
    Promise.all([fetchCVData]) // , fetchNewsHeadlines, fetchNewsTrending, fetchNewsHealth
      .then(res => Promise.all(res.map(response => response.json())))
      .then(results => {
        console.log(results)
        const lastUpdated = new Date(results[0].data.lastChecked).toString();
        const lastUpdatedArr = lastUpdated.split(' ');
        const dateAndTime = `${lastUpdatedArr[0]} ${lastUpdatedArr[1]} ${lastUpdatedArr[2]}, ${lastUpdatedArr[3]} ${lastUpdatedArr[4]}`;
        const data = results[0].data.covid19Stats;
        const worldConfirmed = data.reduce((acc, val) => acc + val.confirmed, 0);
        const worldRecovered = data.reduce((acc, val) => acc + val.recovered, 0);
        const worldDeaths = data.reduce((acc, val) => acc + val.deaths, 0);
        this.compareLastUpdated(dateAndTime, { worldConfirmed, worldRecovered, worldDeaths });
        // const headlines = results[1].articles;
        // const trending = results[2].articles;
        // const health = results[3].articles;
        const headlines = [];
        const trending = [];
        const health = [];
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

  render() {
    const { data, news, dataView, countriesColorData, searchInput, showAll, mapView, lastUpdated, world, worldConfirmed, worldRecovered, worldDeaths } = this.state;
    console.log(news);
    // if (data.length === 0) return <div>LOADING...</div>
    // if (!news) return null;
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
              <small>Infections: <strong style={{ color: 'purple' }}>{world.confirmed}{worldConfirmed ? <i className="fas fa-long-arrow-alt-up infections-increased"></i> : typeof worldConfirmed === 'string' ? <i className="fas fa-long-arrow-alt-down"></i> : `~`}</strong></small>
              <small>Recovered: <strong style={{ color: 'green' }}>{world.recovered}{worldRecovered ? <i className="fas fa-long-arrow-alt-up recovered-increased"></i> : typeof worldRecovered === 'string' ? <i className="fas fa-long-arrow-alt-down"></i> : `~`}</strong></small>
              <small>Deaths: <strong style={{ color: 'red' }}>{world.deaths}{worldDeaths ? <i className="fas fa-long-arrow-alt-up deaths-increased"></i> : typeof worldDeaths === 'string' ? <i className="fas fa-long-arrow-alt-down"></i> : `~`}</strong></small>
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
        {/* <Tabs>
          <div label="Today's Headlines">
            <News news={news.headlines} />
          </div>
          <div label="Trending">
            <News trending={true} news={news.trending} />
          </div>
          <div label="Health">
            <News news={news.health} />
          </div>
        </Tabs> */}
        {/* {showAll ? <DataTable handleShowAllBtn={this.handleShowAllBtn} data={data} /> : <DataTable handleShowAllBtn={this.handleShowAllBtn} data={dataView.length > 0 ? dataView : data} />} */}
      </>
    );
  }
}
