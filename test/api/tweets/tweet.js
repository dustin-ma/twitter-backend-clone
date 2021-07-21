process.env.NODE_ENV = "test";

var host = "http://localhost:5000";

const expect = require("chai").expect;
const request = require("supertest");

const router = require("../../../routes.js");
const conn = require("../../../connect.js");

describe("GET/POST /tweets", () => {
  let test_tweet_id = "";
  let userId = "";
  let token = "";

  before((done) => {
    conn
      .mockConnect()
      .then(() => done())
      .catch((err) => done(err));
  });

  after((done) => {
    conn
      .close()
      .then(() => done())
      .catch((err) => done(err));
  });

  it("TEST: Making a new test user", (done) => {
    request(host)
      .post("/api/register")
      .send({
        username: "TESTING",
        password: "123456789",
      })
      .then((res) => {
        const body = res.body;
        userId = body._id;
        expect(res.statusCode).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });

  it("TEST: Login as the test user", (done) => {
    request(host)
      .post("/api/login")
      .send({
        username: "TESTING",
        password: "123456789",
      })
      .then((res) => {
        const body = res.body;
        token = body.data;
        expect(res.statusCode).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });

  it("TEST: Posting a new tweet to DB", (done) => {
    request(host)
      .post("/api/tweet")
      .send({
        username: "TESTING",
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

  it("TEST: Liking a tweet that exists", (done) => {
    request(host)
      .post(`/api/like-tweet/${test_tweet_id}`)
      .send({
        username: "TESTING",
      })
      .set({ Authorization: `Bearer ${token}` })
      .then((res) => {
        expect(res.statusCode).to.equal(201);
        done();
      });
  });

  it("TEST: Unliking a tweet that was previously liked", (done) => {
    request(host)
      .post(`/api/like-tweet/${test_tweet_id}`)
      .send({
        username: "TESTING",
      })
      .set({ Authorization: `Bearer ${token}` })
      .then((res) => {
        expect(res.statusCode).to.equal(201);
        done();
      });
  });

  it("TEST: Invalid tweet with empty text field", (done) => {
    request(host)
      .post("/api/tweet")
      .send({
        username: "TESTING",
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
        expect(body.length).to.be.a("number");
        done();
      })
      .catch((err) => done(err));
  });

  it("TEST: Updating an existing tweet ", (done) => {
    request(host)
      .post(`/api/update-tweet/${test_tweet_id}`)
      .send({
        username: "TESTING",
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
        username: "TESTING",
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
        username: "TESTING",
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
        username: "TESTING",
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
        username: "TESTING",
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
        username: "TESTING",
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
        username: "TESTING",
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
        username: "TESTING",
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

  it("TEST: Deleting the test user [TESTING]", (done) => {
    request(host)
      .get(`/api/delete-user/${userId}`)
      .then((res) => {
        expect(res.statusCode).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });
});
