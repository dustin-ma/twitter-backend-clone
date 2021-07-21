﻿# leapgrad-assessment

## To start the server

```
servermon server
```

### To configure between MongoDB and MockgooseDB (for unit testing)

- MockDB (in server.js) : 
```
process.env.NODE_ENV = "test";
```
- MongoDB (in server.js): 
```
process.env.NODE_ENV = ""; //OR ANYTHING OTHER THAN "text"
```

### To run all unit/integration tests :

```
servermon server
npm run test
```

All tests were passed locally, please let me know if there are any issues running the code. Note that the server must be running before running the tests.

## For the commenting (threading) endpoint

A comment is treated as a new tweet. Every tweet has a <comments> property that holds an array of tweets as its comments. This allows for comments to be retweeted and commented on as well.

## For the retweeting endpoint

A retweet is also treated as a new tweet but unlike a comment, it stores the original tweet's tweet_id into its <reference> property. This way it allows for retweets to point to its parents (like a linked list) and the parent can not trace down to its retweets (like the actual twitter model)

## For the user login environment design

I've decided to utilize JWT for session control for this assessment, every time a user logs in, a JWT token is returned and the front-end may locally store the
token and use it to authorize api calls. The token may expire or be blacklisted
but to simplify things for the assessment, the tokens in this program do not expire. Therefore, there is no 'log-out' function implemented.

I am particularly happy with the design of the commenting/retweeting system as I was able to somewhat accurately mimic the functional design of Twitter. However, the login and user maintenance aspect could use more work and I am aiming to improve my knowledge and skills on the topic!

Thank you for your time and consideration, please let me know if there are any issues with running the code. If not, I'd love to hear some feedback that may help me improve on my skills!

Best regards,
Dustin Ma
