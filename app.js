const express = require('express');
const{ getTopics}=require('./controllers/topicscontroller')
const{ getArticles}=require('./controllers/articlescontrollers')

const app=express();


app.get("/api/topics", getTopics);


app.get("/api/articles", getArticles);


app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error' });
})

app.use((req, res, next) => {
    res.status(404).send({ msg: 'Page not found' })
})

module.exports = app;
