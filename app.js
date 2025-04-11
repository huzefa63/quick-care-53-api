const express = require('express');
const app = express();
const doctorRoute = require('./routes/doctorRoutes');
const appointmentRoute = require('./routes/appointmentRoutes');
const userRoute = require('./routes/userRoutes');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config('.env');
app.use(express.urlencoded({extended:true}));
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use(
  cors({
    origin: "https://quick-care-53.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight OPTIONS requests
app.options("*", cors());


app.post(
  "/appointments/webhook",
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

app.use(express.json());
app.use("/appointments", appointmentRoute);

app.use('/doctors',doctorRoute);
app.use("/user", userRoute);




module.exports = app;
