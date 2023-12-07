const apiRouter = require("express").Router();
const articles = require("./articles-router");
const comments = require("./comments-router");
const topics = require("./topics-router");
const users = require("./users-router");
const { getEndpoints } = require("../controllers/api-controller");

apiRouter.use("/articles", articles);
apiRouter.use("/comments", comments);
apiRouter.use("/topics", topics);
apiRouter.use("/users", users);

apiRouter.route("/").get(getEndpoints);

module.exports = apiRouter;
