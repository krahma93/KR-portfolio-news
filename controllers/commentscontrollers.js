const {
  fetchCommentsById,
  addComment,
  removeComment,
} = require("../models/commentsmodels");
const { selectArticle } = require("../models/articlesmodels");

exports.commentsById = (req, res, next) => {
  const id = req.params.article_id;
  const promises = [fetchCommentsById(id), selectArticle(id)];
  Promise.all(promises)
    .then((promises) => {
      res.status(200).send({ comments: promises[0] });
    })
    .catch(next);
};

exports.postArticleComment = (req, res, next) => {
  const id = req.params.article_id;
  const sentData = req.body;
  const promises = [addComment(id, sentData), selectArticle(id)];
  Promise.all(promises)
    .then((promises) => {
      res.status(201).send({ comment: promises[0] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const id = req.params.comment_id;
  const promises = [removeComment(id), selectArticle(id)]
  Promise.all(promises)
  .then((promises) => {
      res.status(204).send(promises);
    })
    .catch((err) => {
      next(err);
    });
};
