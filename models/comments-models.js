const db = require("../db/connection");

exports.insertComment = (newComment, article_id) => {
  const { username, body } = newComment;
  return db
    .query(
      `INSERT INTO comments (body, author, article_id) 
      VALUES ($1, $2, $3) 
      RETURNING *;`,
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
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "404: Comment doesn't exist",
        });
      }
      return result.rows[0];
    });
};

exports.updateCommentVotes = (votes, comment_id) => {
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`,
      [votes.inc_votes, comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "404: Comment doesn't exist",
        });
      }
      return rows[0];
    });
};
