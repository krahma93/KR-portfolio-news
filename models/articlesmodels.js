const db = require('../db/connection');



exports.fetchArticles = () => {
   
    return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes,
    (COUNT(comments.comment_id) ::INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id;`).then((articles) => {
    return articles.rows })
}
    

exports.selectArticle = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`,[id]).then(({rows: article})=>
    {
        if(article.length ===0) {
            return Promise.reject({status: 404, msg: "Article id does not exist"})
        } else { return article[0]
        }
    })
}
    
