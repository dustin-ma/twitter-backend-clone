process.env.NODE_END = "test";
var host = "http://localhost:5000";
const token = process.env.TEST_TOKEN;

const expect = require("chai").expect;
const request = require("supertest");

const router = require("../../../routes.js");
const conn = require("../../../connect.js");

describe("GET/POST /tweets", () => {
  let test_tweet_id = "";

  before((done) => {
    conn
      .connect()
      .then(() => done())
      .catch((err) => done(err));
  });

  after((done) => {
    conn
      .close()
      .then(() => done())
      .catch((err) => done(err));
  });

  it("TEST: Posting a new tweet to DB", (done) => {
    request(host)
      .post("/api/tweet")
      .send({
        username: "TESTING_USERNAME",
        text: "TESTING TWEET CONTENT",
      })
      .set({ Authorization: `Bearer ${token}` })
      .then((res) => {
        const body = res.body;
        test_tweet_id = body._id;
        expect(body).to.contain.property("_id");
        expect(body).to.contain.property("username");
        expect(body).to.contain.property("text");
        done();
      });
  });

  it("TEST: Invalid tweet with empty text field", (done) => {
    request(host)
      .post("/api/tweet")
      .send({
        username: "TESTING_USERNAME",
        text: "",
      })
      .set({ Authorization: `Bearer ${token}` })
      .then((res) => {
        expect(res.statusCode).to.equal(400);
        done();
      });
  });

  it("TEST: Getting all tweets from DB", (done) => {
    request(host)
      .get("/api/tweets")
      .then((res) => {
        const body = res.body;
        expect(res.statusCode).to.equal(201);
        expect(body.length).to.equal(1);
        done();
      })
      .catch((err) => done(err));
  });

  it("TEST: Updating an existing tweet ", (done) => {
    request(host)
      .post(`/api/update-tweet/${test_tweet_id}`)
      .send({
        username: "TESTING_USERNAME",
        text: "updated text",
      })
      .then((res) => {
        // const body = res.body;
        expect(res.statusCode).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });

  it("TEST: Updating an existing tweet with invalid text input ", (done) => {
    request(host)
      .post(`/api/update-tweet/${test_tweet_id}`)
      .send({
        username: "TESTING_USERNAME",
        text: "",
      })
      .then((res) => {
        // const body = res.body;
        expect(res.statusCode).to.equal(400);
        done();
      })
      .catch((err) => done(err));
  });

  it("TEST: Updating a non-existing tweet ", (done) => {
    request(host)
      .post(`/api/update-tweet/non-existing-id`)
      .send({
        username: "TESTING_USERNAME",
        text: "updated text",
      })
      .then((res) => {
        // const body = res.body;
        expect(res.statusCode).to.equal(400);
        done();
      })
      .catch((err) => done(err));
  });

  it("TEST: Making a retweet with a valid tweet id ", (done) => {
    request(host)
      .post(`/api/retweet/${test_tweet_id}`)
      .send({
        username: "TESTING_USERNAME",
        text: "This is a retweet",
        reference: test_tweet_id,
      })
      .then((res) => {
        const body = res.body;
        expect(res.statusCode).to.equal(201);
        expect(body.reference).to.equal(test_tweet_id); // the retweet should save the original tweet id in its reference field
        done();
      })
      .catch((err) => done(err));
  });

  it("TEST: Making a retweet with an invalid tweet id ", (done) => {
    request(host)
      .post(`/api/retweet/60f651ee8742d1111111111e`)
      .send({
        username: "TESTING_USERNAME",
        text: "This is a retweet",
        reference: "60f651ee8742d1111111111e",
      })
      .then((res) => {
        const body = res.body;
        expect(res.statusCode).to.equal(400);
        done();
      })
      .catch((err) => done(err));
  });

  it("TEST: Commenting on a tweet with valid inputs ", (done) => {
    request(host)
      .post(`/api/comment-tweet/${test_tweet_id}`)
      .send({
        username: "TESTING_USERNAME",
        comment: "This is a comment",
      })
      .then((res) => {
        const body = res.body;
        expect(res.statusCode).to.equal(201);
        expect(body.comments.length).to.equal(1);
        done();
      })
      .catch((err) => done(err));
  });

  it("TEST: Commenting on a tweet with invalid inputs ", (done) => {
    request(host)
      .post(`/api/comment-tweet/${test_tweet_id}`)
      .send({
        username: "TESTING_USERNAME",
      })
      .then((res) => {
        expect(res.statusCode).to.equal(400);
        done();
      })
      .catch((err) => done(err));
  });

  it("TEST: Commenting on a non-existing tweet ", (done) => {
    request(host)
      .post(`/api/comment-tweet/60f651ee8742d1111111111e`)
      .send({
        username: "TESTING_USERNAME",
        comment: "This is a comment",
      })
      .then((res) => {
        expect(res.statusCode).to.equal(400);
        done();
      })
      .catch((err) => done(err));
  });

  it("TEST: Deleting a tweet with a valid tweet id ", (done) => {
    request(host)
      .get(`/api/delete-tweet/${test_tweet_id}`)
      .then((res) => {
        expect(res.statusCode).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });

  it("TEST: Deleting a tweet with an invalid tweet id ", (done) => {
    request(host)
      .get(`/api/delete-tweet/60f651ee8742d1111111111e`)
      .then((res) => {
        expect(res.statusCode).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });
});
