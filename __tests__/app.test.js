
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
        .then(({body: topicsArray})=>{
            expect((topicsArray)).toBeInstanceOf(Array);
            expect(topicsArray.length).toBe(3); 
            expect(topicsArray[0]).toEqual(
                  expect.objectContaining({
                    slug: expect.any(String),
                    description: expect.any(String),
                
                  }))     
        })
    })
})