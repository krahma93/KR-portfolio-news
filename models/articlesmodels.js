const db = require("../db/connection");

exports.fetchArticles = async (topic, sort_by = "created_at", order = "desc") => {
  let queryStr = `SELECT articles.*,
  CAST(COUNT(comments.comment_id) AS int) AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  GROUP BY articles.article_id`

  let queryArray = [];

  if (topic !== undefined) {
      queryStr += ` HAVING topic = $1`;
      queryArray.push(topic);
  }

  queryStr += ` ORDER BY ${sort_by} ${order};`;

  const articlesInfo = await db.query(queryStr, queryArray)

  return articlesInfo.rows;
}

exports.selectArticle = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then(({ rows: article }) => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article id does not exist",
        });
      } else {
        return article[0];
      }
    });
};

exports.updateVotes = (id, votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;`,
      [id, votes]
    )
    .then(({ rows: article }) => {
      return article[0];
    });
};
