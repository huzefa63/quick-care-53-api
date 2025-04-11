const express = require('express');
const app = express();
const doctorRoute = require('./routes/doctorRoutes');
const appointmentRoute = require('./routes/appointmentRoutes');
const userRoute = require('./routes/userRoutes');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config('.env');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({origin:'*'}));

app.use('/doctors',doctorRoute);
app.use("/appointments", appointmentRoute);
app.use("/user", userRoute);




module.exports = app;