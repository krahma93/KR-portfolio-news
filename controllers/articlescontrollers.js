const { fetchArticles } = require("../models/articlesmodels");



exports.getArticles = (req, res, next) => {
    fetchArticles().then((articles)=> {
        res.status(200).send({ articles }); 
    })
}