const articlesRouter = require("express").Router();
const {
  getArticleById,
  getArticleList,
  patchArticleVotes,
  getArticleComments,
} = require("../controllers/articles-controllers");

const { postComment } = require("../controllers/comments-controllers");

articlesRouter.route("/").get(getArticleList);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postComment);

module.exports = articlesRouter;
