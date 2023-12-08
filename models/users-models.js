const db = require("../db/connection");

exports.queryUsers = () => {
  return db.query("SELECT * FROM users;").then((result) => {
    return result.rows;
  });
};

exports.queryUser = (username) => {
  return db
    .query("SELECT * FROM users WHERE username = $1;", [username])
    .then((result) => {
      if (!result.rows[0]) {
        return Promise.reject({
          status: 404,
          msg: "404: User doesn't exist",
        });
      }
      return result.rows[0];
    });
};
