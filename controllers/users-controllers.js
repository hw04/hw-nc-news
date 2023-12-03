const { queryUsers } = require("../models/users-models");

exports.getUsers = (request, response, next) => {
  queryUsers()
    .then((result) => {
      response.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};
