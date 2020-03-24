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
      USData: [],
      stateData: null,
      searchInput: '',
      showAll: false,
      setContent: '',
      content: '',
      countryCodeData: null,
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
        data.sort((a, b) => b.latest.deaths - a.latest.deaths);
        const USData = data.filter(val => val.country_code === 'US');
        let confirmed = {}, countries = [];
        for (let i = 0; i < data.length; i++) {
          // countries.push(data[i].country);
          // for (let countryIndex = 0; countryIndex < countries.lengthl countryIndex++) {
          //   if (countries[z] === data[i].country)
          // }
          confirmed[data[i].country_code] = data[i].latest.deaths;
        }
        this.setState({ data, dataView: data, USData });
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
      console.log(dataView);
      if (showAll) this.setState({ dataView, searchInput: '', showAll: false });
      else this.setState({ dataView, searchInput: '' });
    }
  }

  setTooltipContent(info) {
    this.setState({ setContent: info, content: info })
  }

  render() {
    const { data, dataView, searchInput, showAll, content, setContent, countryCodeData, USData } = this.state;
    const mapWidth = 1080, height = mapWidth / 2;
    if (data.length === 0) return <div>LOADING...</div>
    return (
      <>
        <Header />
        <WorldMap countryCodeData={countryCodeData} USData={USData} data={data} setTooltipContent={this.setTooltipContent} />
        <ReactTooltip>{content}</ReactTooltip>
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
