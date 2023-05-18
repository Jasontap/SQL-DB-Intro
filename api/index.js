const express = require('express');
const apiRouter = express.Router();
const puppiesRouter = require('./puppies');

apiRouter.use('*', (req, res, next) => {
  console.log('request came in to the api router');
  next();
})

apiRouter.use('/puppies', puppiesRouter);
apiRouter.use('/users', require('./users'));


module.exports = apiRouter;
