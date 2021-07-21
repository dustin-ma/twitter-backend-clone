// this function validates the token and can be used before any api calls

const jwt = require("jsonwebtoken");

module.exports = function verify(req, res, token) {
  //verify if the token belongs to the user!

  try {
    if (jwt.verify(token, process.env.JWT_SECRET_KEY)) return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
