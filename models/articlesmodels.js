const db = require('../db/connection');



exports.fetchArticles = () => {
   
    return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes,
    (COUNT(comments.comment_id) ::INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id;`).then((articles) => {
    return articles.rows })
}
    
