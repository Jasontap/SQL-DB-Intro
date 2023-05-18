const express = require('express');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;
const userRouter = express.Router();
const { getAllUsers, createUser } = require('../db');

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

module.exports = userRouter;
