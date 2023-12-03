const db = require("../db/connection");

exports.queryArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "404: Article doesn't exist",
        });
      }
      return result.rows[0];
    });
};

exports.queryArticles = (topic) => {
  if (topic) {
    return db
      .query(
        `SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
      FROM articles 
      LEFT JOIN comments ON comments.article_id = articles.article_id
      WHERE topic = $1
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;
      `,
        [topic]
      )
      .then((result) => {
        return result.rows;
      });
  } else {
    return db
      .query(
        `SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;`
      )
      .then((result) => {
        return result.rows;
      });
  }
};

exports.insertVotes = (votes, article_id) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [votes.inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
