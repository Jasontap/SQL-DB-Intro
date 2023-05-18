const jwt = require("jsonwebtoken");

const SECRET = "My little secret";

const user = {
  username: "jason",
  password: "jason123",
};

// creating a token with jwt.sign()
const token = jwt.sign(user, SECRET);
console.log(token);


// decoding the user info with jwt.verify()
const userInfo = jwt.verify(token, SECRET);
console.log(userInfo);
