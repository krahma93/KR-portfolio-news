const db = require("../db/connection");

exports.fetchCommentsById = (id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body FROM comments
    WHERE article_id = $1`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found`,
        });
      }
      return rows;
    });
};
