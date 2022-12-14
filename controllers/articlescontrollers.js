const {
  fetchArticles,
  fetchArticle,
  selectArticle,
  updateVotes,
} = require("../models/articlesmodels");

exports.getArticles = (req, res, next) => {
  fetchArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getArticle = (req, res, next) => {
  const id = req.params.article_id;
  selectArticle(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  const id = req.params.article_id;
  const body = req.body.inc_votes;
  const promises = [updateVotes(id,body), selectArticle(id)]
  Promise.all(promises)
    .then((promises) => {
      res.status(200).send({ article: promises[0] });
    })
    .catch((err) => next(err));
};
