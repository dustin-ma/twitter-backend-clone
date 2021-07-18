// this function validates the token and can be used before any api calls

const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  //check for token in the header
  const token = req.header("auth-token");

  //if the token doesn't exist ... denie access!
  if (!token) return res.status(401).send("Access Denied");

  try {
    //verify if the token belongs to the user!
    const verified = jwt.verify(token, process.env.SECRET_TOKEN);
    req.user = verified;
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};
