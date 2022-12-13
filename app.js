const express = require('express');
const{ getTopics}=require('./controllers/topicscontroller')
const{ getArticles, getArticle}=require('./controllers/articlescontrollers')

const app=express();


app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticle)



app.use((req, res, next) => {
    res.status(404).send({ msg: 'Page not found' })
})

app.use((err, req, res, next) => {
    res.status(err.status).send({ msg: err.msg })
})

app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error' });
})

module.exports = app;
