const { topicsModel } = require("../models/model.js");

const topicsController = (request, response) => {
  topicsModel().then((result) => {
    response.status(200).send(result);
  });
};

module.exports = { topicsController };
