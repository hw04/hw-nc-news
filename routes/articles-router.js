const articlesRouter = require("express").Router();
const {
  getArticleById,
  getArticleList,
  patchArticleVotes,
  getArticleComments,
  postArticle,
} = require("../controllers/articles-controllers");

const { postComment } = require("../controllers/comments-controllers");

articlesRouter.route("/").get(getArticleList).post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postComment);

module.exports = articlesRouter;
