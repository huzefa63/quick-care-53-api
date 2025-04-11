const express = require('express');
const { createUser } = require('../controllers/userController');

const route = express.Router();

route.post('/createUser',createUser);
module.exports = route;