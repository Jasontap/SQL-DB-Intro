require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bodyparser = require('body-parser');
const { SECRET_KEY } = process.env;
const { getUserById } = require('./db');


const apiRouter = require('./api');
const {client} = require('./db');


const app = express();
// process.env.PORT
const PORT = process.env.PORT;

// this will cause the error handler to immediately handle the request
// app.use((req, res, next) => {
//   next({message: 'This is an error test'})
// })

app.use(morgan('dev'));
app.use(bodyparser.json());

app.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.headers["authorization"];

  if (!auth) {
    next(); // don't set req.user, no token was passed in
    return;
  }

  if (auth.startsWith(prefix)) {
    // recover the token
    const token = auth.slice(prefix.length);
    try {
      // recover the data
      const { id } = jwt.verify(token, SECRET_KEY);
      

      // get the user from the database
      const results = await getUserById(id);
      // // note: this might be a user or it might be null depending on if it exists

      // // attach the user and move on
      req.user = results.user;

      next();
    } catch (error) {
      // there are a few types of errors here
    }
  }
});

app.use('/api', apiRouter);

// 404 handler (non-existing routes)
app.get('*', (req, res, next) => {
  res.status(404).send('<h1>Sorry this route does not exist!</h1>')
})

app.use((error, req, res, next) => {
  console.error(error);
  res.send({
    message: error.message,
    data: [],
    error: true
  })
})

app.listen(PORT, () => {
  client.connect();
  console.log(`Server is up and running on port ${PORT}!`)
})
