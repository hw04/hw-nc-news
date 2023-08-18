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

exports.queryComments = (article_id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;",
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.insertComment = (newComment, article_id) => {
  const { username, body } = newComment;
  return db
    .query(
      "INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;",
      [body, username, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeComment = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
      comment_id,
    ])
    .then((result) => {
      console.log(result);
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "404: Comment doesn't exist",
        });
      }
      return result.rows[0];
    });
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
