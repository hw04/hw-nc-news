const {
  queryTopics,
  queryArticleById,
  queryArticleList,
  queryComments,
  insertComment,
  removeComment,
  insertVotes,
} = require("../models/articles-models.js");

const endPoints = require("../endpoints.json");

exports.getTopics = (request, response) => {
  queryTopics().then((result) => {
    response.status(200).send(result);
  });
};

exports.getEndpoints = (request, response) => {
  response.status(200).send(endPoints);
};

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  queryArticleById(article_id)
    .then((result) => {
      response.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleList = (request, response, next) => {
  const { topic } = request.query;
  queryArticleList(topic).then((articles) => {
    response.status(200).send(articles);
  });
};

exports.getArticleComments = (request, response, next) => {
  const { article_id } = request.params;
  return Promise.all([articleIdModel(article_id), queryComments(article_id)])
    .then((resolvedPromises) => {
      response.status(200).send(resolvedPromises[1]);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (request, response, next) => {
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

exports.deleteComment = (request, response, next) => {
  const { comment_id } = request.params;
  removeComment(comment_id)
    .then((result) => {
      response.status(204).send(result);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVotes = (request, response, next) => {
  const { article_id } = request.params;
  const votes = request.body;
  return Promise.all([
    articleIdModel(article_id),
    insertVotes(votes, article_id),
  ])
    .then((resolvedPromises) => {
      response.status(200).send({ article: resolvedPromises[1] });
    })
    .catch((err) => {
      next(err);
    });
};
