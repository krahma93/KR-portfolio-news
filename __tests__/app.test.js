
const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed')
const testData = require("../db/data/test-data/index")


beforeEach(()=> seed(testData));

afterAll(()=> db.end());

describe('GET /api/topics', ()=>{
    test('return an array of topic object each of which have a slug and description', ()=>{
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body: {topics} }) => {
            expect(topics).toBeInstanceOf(Array);
            expect(topics.length).toBe(3); 
            topics.forEach(topics => {
                expect(topics).toEqual(
                expect.objectContaining({
                  slug: expect.any(String),
                  description: expect.any(String),
              
                })) })
                
        })
    })
})

describe('api/articles', () => {
    test('returns all articles', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
            expect(articles).toBeInstanceOf(Array);
            expect(articles.length).toBe(12)
            articles.forEach(article => {
                expect(article).toEqual(expect.objectContaining({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(Number)
                })
            );
            })
        });
    })
    test("articles are sorted by date in descending order.", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then((res) => {
                const articles = res.body.articles;
                expect(articles[0].article_id).toBe(4)
                expect(articles[0].created_at).toBe("2020-05-06T01:14:00.000Z")
                expect(articles[11].article_id).toBe(8)
                expect(articles[11].created_at).toBe("2020-04-17T01:08:00.000Z")
            })
        })
    })

  
describe("api/articles/:article_id", () => {
    test("responds with an article object that should have the following properties.", () => {
        return request(app)
            .get("/api/articles/3")
            .expect(200)
            .then((res) => {
                const article = res.body.article;
                const output = {
                    author: "icellusedkars",
                    title: "Eight pug gifs that remind me of mitch",
                    article_id: 3,
                    body: "some gifs",
                    topic: "mitch",
                    created_at: "2020-11-03T09:12:00.000Z",
                    votes: 0
                }
                expect(article).toEqual(output);
            })
    })
    test("returns 404 - path not found if id doesn't exist", () => {
        return request(app)
            .get("/api/articles/1000")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Article id does not exist")
            }) 
    })
    test("Status 400 -  when submitting an invalid ID", () => {
        return request(app)
          .get("/api/articles/bananas")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid ID type");
          });
        })

    describe(' 404 Not Found', ()=>{
        test("returns page not found 404", () => {
            return request(app)
                .get("/api/bananna")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Page not found")
                }) 
        })
    })
})