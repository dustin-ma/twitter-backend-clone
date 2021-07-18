// process.env.NODE_END = "test";
var host = "http://localhost:5000";
const token = process.env.TEST_TOKEN;

const expect = require("chai").expect;
const request = require("supertest");

const router = require("../../../routes.js");
const conn = require("../../../connect.js");

describe("GET /tweets", () => {
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

  it("OK, getting tweets works", (done) => {
    request(host)
      .get("/api/tweets")
      .then((res) => {
        const body = res.body;
        expect(body.length).to.be.a("number").that.is.not.equal(0);
        done();
      })
      .catch((err) => done(err));
  });
});

describe("POST /tweet", () => {
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

  it("OK, making a new tweet works", (done) => {
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
});
