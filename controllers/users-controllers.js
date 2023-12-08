const { queryUsers, queryUser } = require("../models/users-models");

exports.getUsers = (request, response, next) => {
  queryUsers()
    .then((result) => {
      response.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUser = (request, response, next) => {
  const { username } = request.params;
  queryUser(username)
    .then((result) => {
      response.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};
