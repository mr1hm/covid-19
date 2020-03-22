import React, { Component } from 'react';
import Header from './layout/header';
import DataTable from './dataTable';
import WorldMap from './worldMap';
import ReactTooltip from 'react-tooltip';
import abbrState from './stateHelper';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataView: [],
      searchInput: '',
      showAll: false,
      setContent: '',
      content: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleShowAllBtn = this.handleShowAllBtn.bind(this);
    this.setTooltipContent = this.setTooltipContent.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    fetch(`http://covid19api.xapix.io/v2/locations`)
      .then(res => res.json())
      .then(info => {
        let data = Object.entries(info).shift()[1];
        data.sort((a, b) => b.latest.confirmed - a.latest.confirmed);
        this.setState({ data, dataView: data });
      })
      .catch(err => console.error(err));
  }

  mapHandler(e) {
    console.log(e.target.dataset.title);
    alert(e.target.dataset.name);
  }

  statesCustomConfig() {
    const data = this.state.data.slice();
    const USData = data.filter((val, i) => val.country === 'US');
    let sortedUSData = USData.sort((a, b) => b.latest.confirmed - a.latest.confirmed),
      colorData = ['#8B0000', '#EE0000', '#FF0000', '#FF6D6D', '#FF6F6F', '#FF7777', '#FF9090', '#FF9393', '#FFCDCD', '#FFD5D5'],
      USDataFinal = [];
    console.log(sortedUSData);
    for (let i = 0; i < sortedUSData.length; i++) {
      if (i < 10) {
        sortedUSData[i].color = colorData[i];
        USDataFinal.push(sortedUSData[i]);
      } else {
        break;
      }
    }
    let stateCustomizeObj = {};
    for (let state = 0; state < USDataFinal.length; state++) {
      if (USDataFinal[state].color) {
        stateCustomizeObj[`${abbrState(USDataFinal[state].province, 'abbr')}`] = {
          fill: `${USDataFinal[state].color}`,
          clickHandler: e => console.log('DANGER', e.target.dataset)
        }
      }
    }
    console.log(stateCustomizeObj)
    return stateCustomizeObj;
  }
  // {
  //   "CA": {
  //     fill: 'red',
  //       clickHandler: e => console.log('custom handler for california', e.target.dataset),
  //   },
  //   "TX": {
  //     fill: 'blue',
  //       clickHandler: e => console.log('custom handler for texas', e.target.dataset),
  //   }
  // }

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
      console.log(dataView);
      if (showAll) this.setState({ dataView, searchInput: '', showAll: false });
      else this.setState({ dataView, searchInput: '' });
    }
  }

  render() {
    const { data, dataView, searchInput, showAll } = this.state;
    if (data.length === 0) return <div>LOADING...</div>
    return (
      <>
        <Header />
        <main className="usa-map-container container">
          <section className="map">
            <div className="col d-flex justify-content-center">
              <USAMap customize={this.statesCustomConfig()} onClick={this.mapHandler} />
            </div>
          </section>
        </main>
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
