const db = require("../db/connection");

exports.queryTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};

exports.checkTopicExists = (topic) => {
  return db.query("SELECT * FROM topics;").then((result) => {
    if (result.rows.every((element) => element.slug !== topic)) {
      return Promise.reject({
        status: 404,
        msg: "404: Topic doesn't exist",
      });
    }
  });
};
