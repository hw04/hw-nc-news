const handle400Errors = (err, request, response, next) => {
  const { code, constraint } = err;
  if (code === "22P02" || code === "23502") {
    response.status(400).send({ msg: "400: Bad request" });
  } else if (code === "23503" && constraint === "comments_author_fkey") {
    response.status(400).send({ msg: "400: Invalid username!" });
  } else if (code === "23503" && constraint === "articles_author_fkey") {
    response.status(400).send({ msg: "400: Invalid author!" });
  } else if (code === "23503" && constraint === "articles_topic_fkey") {
    response.status(400).send({ msg: "400: Invalid topic!" });
  } else {
    next(err);
  }
};

const handleCustomErrors = (err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

const handle500Error = (err, request, response, next) => {
  response.status(500).send({ msg: "Internal server error" });
};

module.exports = { handle400Errors, handleCustomErrors, handle500Error };
