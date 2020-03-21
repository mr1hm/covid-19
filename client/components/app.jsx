import React, { Component } from 'react';
import Header from './layout/header';
import DataTable from './dataTable';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataView: [],
      searchInput: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
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

  handleShowAll() {
    this.setState({ data })
  }

  handleInputChange(e) {
    const name = e.target.name, value = e.target.value
    this.setState({ [name]: value })
  }

  handleSearchSubmit(e) {
    const { searchInput } = this.state;
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
      this.setState({ dataView, searchInput: '' });
    }
  }

  render() {
    const { data, dataView, searchInput } = this.state;
    if (data.length === 0) return <div>LOADING...</div>
    return (
      <>
        <Header />
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
        <DataTable data={data} dataView={dataView} />
      </>
    );
  }
}
