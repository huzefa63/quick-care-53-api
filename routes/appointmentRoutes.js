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
route.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        `${process.env.STRIPE_WEBHOOK_SECRET}`
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle successful checkout session
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      if (session.payment_status === "paid") {

        // TODO: Call your function to save appointment, e.g.
        const appointment = {
           date: session.metadata.date,
      doctor: session.metadata.doctor,
      userId: session.metadata.userId,
      status: session.metadata.status,
      fee: session.metadata.fee,
        };
        await Appointment.create(appointment);
        // createAppointment({ doctorId, userId, appointmentTime });
      }
    }

    res.status(200).json({ received: true });
  }
);

module.exports = route;
