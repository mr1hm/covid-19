import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tab from './tab';

export default class Tabs extends Component {
  static propTypes = { children: PropTypes.instanceOf(Array).isRequired }
  constructor(props) {
    super(props);
    this.state = {
      activeTab: this.props.children[0].props.label,
    };
  }

  onClickTabItem = tab => {
    this.setState({ activeTab: tab })
  }

  render() {
    const { onClickTabItem, props: { children }, state: { activeTab } } = this;
    return (
      <main className="news-tabs-container container-fluid">
        <section className="row">
          <ol className="col tab-list">
            {children.map(child => {
              const { label } = child.props;
              return (
                <Tab activeTab={activeTab} key={label} label={label} onClick={onClickTabItem} />
              );
            })}
          </ol>
        </section>
        <section className="row">
          <div className="col tab-content">
            {children.map(child => {
              if (child.props.label !== activeTab) return undefined;
              return child.props.children;
            })}
          </div>
        </section>
      </main>
    );
  }
}
