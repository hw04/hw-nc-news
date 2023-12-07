const articlesRouter = require("express").Router();
const {
  getArticleById,
  getArticleList,
  patchVotes,
} = require("../controllers/articles-controllers");

const {
  getArticleComments,
  postComment,
} = require("../controllers/comments-controllers");

articlesRouter.route("/").get(getArticleList);

articlesRouter.route("/:article_id").get(getArticleById).patch(patchVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postComment);

module.exports = articlesRouter;
