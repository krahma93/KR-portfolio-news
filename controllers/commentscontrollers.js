const { fetchCommentsById } = require("../models/commentsmodels");

exports.commentsById = (req, res, next) => {
  const id = req.params.article_id;
  fetchCommentsById(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err)=> {
        next(err)
    });
};
