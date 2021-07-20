process.env.NODE_END = "test";

var host = "http://localhost:5000";
// const token = process.env.TEST_TOKEN;
const expect = require("chai").expect;
const request = require("supertest");

const router = require("../../../routes.js");
const conn = require("../../../connect.js");

let conversationId = "";
let token = "";

describe("TESTING USER OPERATIONS", () => {
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
        // token = res.body.data;
        done();
      })
      .catch((err) => done(err));
  });

  // update password api not tested here since it is an extra feature
});

describe("TESTING MESSAGING OPERATIONS", () => {
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

  it("TEST: Creating User A", (done) => {
    request(host)
      .post("/api/register")
      .send({
        username: "TESTING_USERNAME_A",
        password: "123456789",
      })
      .then((res) => {
        expect(res.statusCode).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });

  it("TEST: Creating User B", (done) => {
    request(host)
      .post("/api/register")
      .send({
        username: "TESTING_USERNAME_B",
        password: "123456789",
      })
      .then((res) => {
        // const body = res.body;
        expect(res.statusCode).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });

  it("TEST: Creating a conversation with User A and B", (done) => {
    request(host)
      .post("/api/conversation")
      .send({
        senderId: "TESTING_USERNAME_A",
        receiverId: "TESTING_USERNAME_B",
      })
      .then((res) => {
        // const body = res.body;
        expect(res.statusCode).to.equal(201);
        conversationId = res.body._id;
        // console.log(conversationId);
        done();
      })
      .catch((err) => done(err));
  });

  it("TEST: Sending a message from User A to B", (done) => {
    request(host)
      .post("/api/message")
      .send({
        conversationId: `${conversationId}`,
        senderId: "TESTING_USERNAME_A",
        text: "MESSAGE FROM A TO B",
      })
      .then((res) => {
        // const body = res.body;
        expect(res.statusCode).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });

  it("TEST: Sending a message from User A to B", (done) => {
    request(host)
      .post("/api/message")
      .send({
        conversationId: `${conversationId}`,
        senderId: "TESTING_USERNAME_B",
        text: "MESSAGE FROM B TO A",
      })
      .then((res) => {
        // const body = res.body;
        expect(res.statusCode).to.equal(201);
        done();
      })
      .catch((err) => done(err));
  });
});
