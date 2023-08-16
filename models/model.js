const db = require("../db/connection");

exports.topicsModel = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};

exports.articleIdModel = (article_id) => {
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

exports.getArticleList = () => {
  return db
    .query(
      "SELECT article_id, title, author, topic, created_at, votes, article_img_url FROM articles ORDER BY created_at DESC"
    )
    .then((result) => {
      return result.rows;
    });
};
