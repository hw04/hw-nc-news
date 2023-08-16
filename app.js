const express = require("express");
const {
  topicsController,
  apiController,
  fetchArticleList,
} = require("./controllers/controller");
const {
  handle400Errors,
  handleCustomErrors,
} = require("./controllers/errors.controller");
const app = express();

app.get("/api/topics", topicsController);

app.get("/api", apiController);

app.get("/api/articles/:article_id", articleIdController);

app.get("/api/articles", fetchArticleList);

app.use(handle400Errors);

app.use(handleCustomErrors);

// app.listen(9090, () => console.log("App listening on port 9090!"));

module.exports = app;
