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
        console.log(data);
        this.setState({ data });
      })
      .catch(err => console.error(err));
  }

  render() {
    const { data } = this.state;
    return (
      <>
        <Header />
        <DataTable data={data} />
      </>
    );
  }
}
