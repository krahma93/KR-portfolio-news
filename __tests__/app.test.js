const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const { response } = require('express');


beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("return an array of topic object each of which have a slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toBeInstanceOf(Array);
        expect(topics.length).toBe(3);
        topics.forEach((topics) => {
          expect(topics).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("api/articles", () => {
  test("returns all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("articles are sorted by date in descending order.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const articles = res.body.articles;
        expect(articles[0].article_id).toBe(4);
        expect(articles[0].created_at).toBe("2020-05-06T01:14:00.000Z");
        expect(articles[11].article_id).toBe(8);
        expect(articles[11].created_at).toBe("2020-04-17T01:08:00.000Z");
      });
  });
});

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
          votes: 0,
        };
        expect(article).toEqual(output);
      });
  });
  test("returns 404 - path not found if id doesn't exist", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article id does not exist");
      });
  });
  test("Status 400 -  when submitting an invalid ID", () => {
    return request(app)
      .get("/api/articles/bananas")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  describe("/api/articles/:article_id/comments", () => {
    test("repond with an array of comments for the given article ID", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(11);
          comments.forEach(comment => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
    });
})
    test('return 200 and an empty array if the article exsists but has no comments', () => {
        return request(app).get('/api/articles/2/comments').expect(200)
        .then(({ body: { comments } }) => {
            expect(comments).toBeInstanceOf(Array);
            expect(comments.length).toBe(0);
        });
    });
    test("Status 400 - Bad request when invalid input is passed", () => {
      return request(app)
        .get("/api/articles/banana/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("Status 404 - Valid request but item not found", () => {
      return request(app)
        .get("/api/articles/10000/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Article id does not exist");
        });
    });
  });

  describe('Post api/articles/id/comment ', () => {
    test('returns posted comment if a valid username is provided', () => {
        const input = {username: 'butter_bridge', body: 'I love this sprint'}

        return request(app).post('/api/articles/1/comments').send(input).expect(201)
        .then(({ body: { comment } }) => {
            expect(comment).toBeInstanceOf(Object);
            expect(comment).toEqual(
                expect.objectContaining({
                    body: "I love this sprint",
                    votes: 0,
                    author: "butter_bridge",
                    article_id: expect.any(Number),
                    created_at: expect.any(String),
                    comment_id: expect.any(Number)
                })
            );
        })
    });

    test('returns 404 when inputted id does not exsit', () => {
        const input = {username: 'butter_bridge', body: 'I love this sprint'}
        return request(app).post('/api/articles/1000/comments').send(input).expect(404)
        .then(({body: { msg }}) => {
            expect(msg).toBe('Article id does not exist')
        })
    });

    test('returns 400 when wrong data is inputted on ID path', () => {
        const input = {username: 'butter_bridge', body: 'I love this sprint'}
        return request(app).post('/api/articles/love/comments').send(input).expect(400)
        .then(({body: { msg }}) => {
            expect(msg).toBe('Bad request')
        })
    });
    test('returns 400 when incorrect post data is inputted', () => {
        const input = {username: 'butter_bridge'}
        return request(app).post('/api/articles/1/comments').send(input).expect(400)
        .then(({body: { msg }}) => {
            expect(msg).toBe('Bad request')
        })
    });

    test('returns 404 when a username does not exist', () => {
        const input = {username: 'incediblehulk', body: 'I love this sprint'}
        return request(app).post('/api/articles/1/comments').send(input).expect(404)
        .then(({body: { msg }}) => {
            expect(msg).toBe('Article id does not exist')
        })
    });

  describe(" 404 Not Found", () => {
    test("returns page not found 404", () => {
      return request(app)
        .get("/api/bananna")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Page not found");
        });
    });
  });
  })
})

