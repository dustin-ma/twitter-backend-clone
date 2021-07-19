process.env.NODE_END = "test";

var host = "http://localhost:5000";
const token = process.env.TEST_TOKEN;
const expect = require("chai").expect;
const request = require("supertest");

const router = require("../../../routes.js");
const conn = require("../../../connect.js");

describe("GET /users", () => {
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

  it("TEST: Retriving all Users from DB", (done) => {
    request(host)
      .get("/api/users")
      .then((res) => {
        const body = res.body;
        expect(res.statusCode).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });

  it("TEST: Making a new user", (done) => {
    request(host)
      .post("/api/register")
      .send({
        username: "TESTUSER123",
        password: "23452345",
      })
      .then((res) => {
        const body = res.body;
        console.log(body);
        expect(res.statusCode).to.equal(400);
      })
      .catch((err) => done(err));
  });
});
