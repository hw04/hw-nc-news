const express = require("express");
const {
  topicsController,
  apiController,
  fetchArticleList,
  addComment,
} = require("./controllers/controller");
const {
  handle400Errors,
  handleCustomErrors,
} = require("./controllers/errors.controller");
const app = express();

app.use(express.json());

app.post("/api/articles/:article_id/comments", addComment);

app.get("/api/topics", topicsController);

app.get("/api", apiController);

app.get("/api/articles/:article_id", articleIdController);

app.get("/api/articles", fetchArticleList);

app.use(handle400Errors);

app.use(handleCustomErrors);

module.exports = app;
