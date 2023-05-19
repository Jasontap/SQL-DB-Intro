const express = require('express');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;
const userRouter = express.Router();
const { getAllUsers, createUser, getSingleUser, getPuppiesByOwnerId } = require('../db');

userRouter.get('/', async (req, res, next) => {
  const results = await getAllUsers();
  res.send(results);
});

userRouter.post('/register', async (req, res, next) => {
  
  const userDBInstance = await createUser(req.body);
  
  if (userDBInstance) {
    const token = jwt.sign(userDBInstance, SECRET_KEY);
    res.send({
      message: 'Thank you for signing up!', 
      token, 
      error: false
    });
  } else {
    next({
      message: 'Username or Email already exists. Please try again with differnt details.'
    })
  }
})


userRouter.post('/login', async (req, res, next) => {
  
  const { username, password } = req.body;
  const results = await getSingleUser(username, password);
  
  if (results.error) {
    next(results);
  } else {
    const token = jwt.sign(results.user, SECRET_KEY);
    res.send({
      message: 'Thank you for signing up!', 
      token, 
      error: false
    });
  }
});


userRouter.get('/mypuppies', async (req, res, next) => {
  const puppies = await getPuppiesByOwnerId(req.user.id)
  
  res.send({
    message: 'Here are all of the puppies you own',
    data: puppies,
    error: false
  })
})

module.exports = userRouter;
