const {
  insertComment,
  removeComment,
  updateCommentVotes,
} = require("../models/comments-models.js");

const { queryArticleById } = require("../models/articles-models.js");

exports.postComment = (request, response, next) => {
  const { article_id } = request.params;
  const newComment = request.body;
  return Promise.all([
    queryArticleById(article_id),
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
      response.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentVotes = (request, response, next) => {
  const { comment_id } = request.params;
  const votes = request.body;
  updateCommentVotes(votes, comment_id)
    .then((result) => {
      response.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};
