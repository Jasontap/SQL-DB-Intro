const express = require('express');
const puppiesRouter = express.Router();
const { getAllPuppies } = require("../db");

puppiesRouter.use('*', (req, res, next) => {
  console.log('REACHING THE PUPPIES ROUTER');
  next();
});

puppiesRouter.get("/", async (req, res, next) => {
  const results = await getAllPuppies();
  res.send(results);
});

module.exports = puppiesRouter;
