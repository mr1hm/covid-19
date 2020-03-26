import React, { Component } from 'react';
import { VectorMap } from 'react-jvectormap';

export default class EuropeMap extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <VectorMap
        map={'europe_mill'}
      />
    );
  }
}
