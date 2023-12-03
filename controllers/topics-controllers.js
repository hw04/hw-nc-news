const { queryTopics } = require("../models/topics-models.js");

exports.getTopics = (request, response) => {
  queryTopics().then((result) => {
    response.status(200).send(result);
  });
};
