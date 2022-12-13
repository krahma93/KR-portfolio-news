const db = require('../db/connection');



exports.fetchArticles = () => {
    const querystr = `SELECT articles.*,
    (COUNT(comments.comment_id) ::INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id;`
    
    return db.query(querystr).then((articles) => {
    return articles.rows })
}
    
