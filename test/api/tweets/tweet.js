process.env.NODE_END = "test";
var host = "http://localhost:5000";
const token = process.env.TEST_TOKEN;

const expect = require("chai").expect;
const request = require("supertest");

const router = require("../../../routes.js");
const conn = require("../../../connect.js");

describe("GET/POST /tweets", () => {
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

  it("TEST: Getting all tweets from DB", (done) => {
    request(host)
      .get("/api/tweets")
      .then((res) => {
        const body = res.body;
        expect(res.statusCode).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });

  it("TEST: Posting a new tweet to DB", (done) => {
    request(host)
      .post("/api/tweet")
      .send({
        username: "TESTUSER",
        text: "TESTING TWEET CONTENT",
      })
      .set({ Authorization: `Bearer ${token}` })
      .then((res) => {
        const body = res.body;
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
        username: "TESTUSER",
        text: "",
      })
      .set({ Authorization: `Bearer ${token}` })
      .then((res) => {
        expect(res.statusCode).to.equal(400);
        done();
      });
  });
});
