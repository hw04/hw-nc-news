const {
  topicsModel,
  articleIdModel,
  insertComment,
  retrieveComment,
  removeComment,
} = require("../models/model.js");
const endPoints = require("../endpoints.json");

const topicsController = (request, response) => {
  topicsModel().then((result) => {
    response.status(200).send(result);
  });
};

apiController = (request, response) => {
  response.status(200).send(endPoints);
};

articleIdController = (request, response, next) => {
  const { article_id } = request.params;
  articleIdModel(article_id)
    .then((result) => {
      response.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};

addComment = (request, response, next) => {
  const { article_id } = request.params;
  const newComment = request.body;
  return Promise.all([
    articleIdModel(article_id),
    insertComment(newComment, article_id),
  ])
    .then((resolvedPromises) => {
      response.status(201).send({ comment: resolvedPromises[1] });
    })
    .catch((err) => {
      next(err);
    });
};

deleteComment = (request, response, next) => {
  const { comment_id } = request.params;
  removeComment(comment_id)
    .then((result) => {
      console.log(result, "result");
      response.status(204).send(result);
    })
    .catch((err) => {
      next(err);
    });
};
module.exports = {
  topicsController,
  apiController,
  articleIdController,
  addComment,
  deleteComment,
};
