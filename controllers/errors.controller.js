const handle400Errors = (err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "400: ID invalid" });
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

module.exports = { handle400Errors, handleCustomErrors };
