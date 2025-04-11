const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const {getCheckoutSession, getAppointment,cancelAppointment,removeAppointment, createAppointment, checkSlot, getAppointmentById } = require("../controllers/appointmentController");
const Appointment = require('../models/appointment');
const User = require('../models/user');

const route = express.Router();

route.post('/getAppointment',getAppointment);
route.post('/cancelAppointment',cancelAppointment);
route.post('/createAppointment',createAppointment);
route.post('/checkSlot',checkSlot);
route.post('/getAppointmentById',getAppointmentById);
route.post('/removeAppointment',removeAppointment);
route.post('/checkout-session',getCheckoutSession);





module.exports = route;
