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

  it("TEST: Making a new user", (done) => {
    request(host)
      .post("/api/register")
      .send({
        username: "TESTING_USERNAME",
        password: "123456789",
      })
      .then((res) => {
        // const body = res.body;
        expect(res.statusCode).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });

  it("TEST: Making a new user with non-unique username", (done) => {
    request(host)
      .post("/api/register")
      .send({
        username: "TESTING_USERNAME",
        password: "123456789",
      })
      .then((res) => {
        // const body = res.body;
        expect(res.statusCode).to.equal(400);
        done();
      })
      .catch((err) => done(err));
  });

  it("TEST: Making a new user with invalid password length", (done) => {
    request(host)
      .post("/api/register")
      .send({
        username: "TESTING_USERNAME2",
        password: "123",
      })
      .then((res) => {
        // const body = res.body;
        expect(res.statusCode).to.equal(400);
        done();
      })
      .catch((err) => done(err));
  });

  it("TEST: Making a new user with invalid username length", (done) => {
    request(host)
      .post("/api/register")
      .send({
        username: "TE",
        password: "12312312",
      })
      .then((res) => {
        // const body = res.body;
        expect(res.statusCode).to.equal(400);
        done();
      })
      .catch((err) => done(err));
  });

  it("TEST: Retriving all Users from DB", (done) => {
    request(host)
      .get("/api/users")
      .then((res) => {
        // const body = res.body;
        expect(res.statusCode).to.equal(201);
        expect(res.body.length).to.equal(1);
        done();
      })
      .catch((err) => done(err));
  });

  it("TEST: Logging in as a test user and expect a JWT token to be returned", (done) => {
    request(host)
      .post("/api/login")
      .send({
        username: "TESTING_USERNAME",
        password: "123456789",
      })
      .then((res) => {
        const body = res.body;
        expect(res.statusCode).to.equal(201);
        expect(body).to.contain.property("data"); // this contains the JWT token
        done();
      })
      .catch((err) => done(err));
  });

  // update password api not tested here since it is an extra feature
});
