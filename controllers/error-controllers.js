const handle400Errors = (err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "400: Bad request" });
  } else if (err.code === "23503") {
    response.status(400).send({ msg: "400: Invalid username" });
  } else if (err.code === "23502") {
    response.status(400).send({ msg: "400: Field cannot be empty!" });
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
  console.log(err);
  response.status(500).send({ msg: "Internal server error" });
};

module.exports = { handle400Errors, handleCustomErrors, handle500Error };
