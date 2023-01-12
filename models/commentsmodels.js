const db = require("../db/connection");

exports.fetchCommentsById = (id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body FROM comments
    WHERE article_id = $1`,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.addComment = (id, sentData) => {
  const username = sentData.username;
  const body = sentData.body;

  return db
    .query(
      "INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;",
      [body, username, id]
    )
    .then(({ rows: article }) => {
      return article[0];
    });
};

exports.removeComment = (id) => {
  return db
    .query(
      `DELETE 
  FROM comments 
  WHERE comment_id = $1
  RETURNING *;`,
      [id]
    )
    .then((comments) => { 
      if (comments.rows.length === 0)  {return Promise.reject({
        status: 404,
        msg: "Article id does not exist",
      });}
      return comments.rows;
    });
};
