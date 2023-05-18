require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bodyparser = require('body-parser');


const apiRouter = require('./api');
const {client} = require('./db');


const app = express();
const PORT = 3000;

// this will cause the error handler to immediately handle the request
// app.use((req, res, next) => {
//   next({message: 'This is an error test'})
// })

app.use(morgan('dev'));
app.use(bodyparser.json());

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
