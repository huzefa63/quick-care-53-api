const express = require('express');
const { getAllDoctors, getDoctor } = require('../controllers/doctorController');

const route = express.Router();

route.get('/allDoctors',getAllDoctors);
route.post('/getDoctor',getDoctor);

module.exports = route;