const {
  queryArticleById,
  queryArticles,
  insertVotes,
} = require("../models/articles-models.js");

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
  return Promise.all([queryArticles(topic)])
    .then((articles) => {
      response.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVotes = (request, response, next) => {
  const { article_id } = request.params;
  const votes = request.body;
  return Promise.all([
    queryArticleById(article_id),
    insertVotes(votes, article_id),
  ])
    .then((resolvedPromises) => {
      response.status(200).send({ article: resolvedPromises[1] });
    })
    .catch((err) => {
      next(err);
    });
};
