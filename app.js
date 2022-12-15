const express = require("express");
const { getTopics } = require("./controllers/topicscontroller");
const {
  getArticles,
  getArticle,
  patchArticle,
  getComments,
} = require("./controllers/articlescontrollers");
const {
  commentsById,
  postArticleComment,
  deleteComment
} = require("./controllers/commentscontrollers");

const { getUsers } = require("./controllers/usercontrollers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles/:article_id/comments", commentsById);

app.post("/api/articles/:article_id/comments", postArticleComment);

app.patch("/api/articles/:article_id", patchArticle);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id/comments", getComments);

app.delete("/api/comments/:comment_id", deleteComment)


app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Page not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.code === "42703" || err.code === "42601") {
    res.status(400).send({ msg: "incorrect query" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Article id does not exist" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
