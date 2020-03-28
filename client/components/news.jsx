import React, { Component } from 'react';

export default class News extends Component {
  constructor(props) {
    super(props);
  }

  filteredNews() {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    const date = [year, month, day].join('-');
  }

  render() {
    const { news } = this.props;
    return (
      <main className="news-container container">
        <section className="row flex-column">
          <div className="col d-flex flex-column">
            {news.map((article, i) => {
              return (
                <div className="article">
                  <h5><a href={article.url} target="_blank">{article.title}</a></h5>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    );
  }
}
