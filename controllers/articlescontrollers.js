const {
  fetchArticles,
  selectArticle,
  updateVotes,
  fetchcomments,
} = require("../models/articlesmodels");

exports.getArticles = async (req, res, next) => {
  const { topic, sort_by, order } = req.query;
  try {
    const articles = await fetchArticles(topic, sort_by, order);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
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
  const promises = [updateVotes(id, body), selectArticle(id)];
  Promise.all(promises)
    .then((promises) => {
      res.status(200).send({ article: promises[0] });
    })
    .catch((err) => next(err));
};

exports.getComments = (req, res, next) => {
  const id = req.params.article_id;
  fetchComments(id).then(comments);
  res.status(200).send({ comments });
};
