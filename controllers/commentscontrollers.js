const { fetchCommentsById } = require("../models/commentsmodels");
const { selectArticle } = require("../models/articlesmodels");


exports.commentsById = (req, res, next) => {
  const id = req.params.article_id;
  const promises = [fetchCommentsById(id), selectArticle(id)]
  Promise.all(promises)
    .then((promises) => {
      res.status(200).send({ comments: promises[0] });
    })
    .catch(next);
};
