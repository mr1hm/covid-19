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

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    const date = [year, month, day].join('-');
  }

  render() {
    const { news } = this.props;
    return (
      <main className="news-container container-fluid">
        <section className="row justify-content-center">
          {news.length > 0 ? news.map((article, i) => {
            let articleTitle;
            if (article.title.includes('-')) articleTitle = article.title.split(' - ')[0];
            return (
              <div key={i} className="col-12 col-md-6 col-lg-6 col-xl-3 d-flex card-article">
                <div className="card">
                  {article.urlToImage ? <img className="card-img-top article-card-img img-fluid" src={article.urlToImage} alt="article-image" /> : <img className="card-img-top" src={article.urlToImage} alt="No Image Available" />}
                  <div className="card-body">
                    <h5 className="card-title article-source"><a href={article.url} target="_blank" className="article-source-name">{article.source.name.toUpperCase()}<i className="fas fa-angle-double-right article-source-arrow"></i></a></h5>
                    <p className="card-text article-title">{article.title || articleTitle}</p>
                  </div>
                </div>
              </div>
            );
          }) : <div>Sorry, there are no trending articles currently.</div>}
        </section>
      </main>
    );
  }
}
