const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const catchAsync = require("../utils/catchAsync");
const User = require('../models/user');
const Doctor = require('../models/doctor');
const Appointment = require('../models/appointment');
exports.getAppointment = catchAsync(async (req,res) => {
  
    const user = await User.findOne({email:req.body.email});
    
    console.log(user);
    const appointments = await Appointment.find({
      userId: user._id,
    })
      .populate("doctor", "name image")
      console.log(appointments);
      res.status(200).json({appointments});
})

exports.getAppointmentById = catchAsync(async (req,res) => {
  
    const appointment = await Appointment.findById(req.body.id);
    res.status(200).json({status:appointment.status});
   
})

exports.cancelAppointment = catchAsync(async (req,res) => {
  
    // const user = await User.findOne({email:req.body.email});
    
    // console.log(user);
    const appointments = await Appointment.findByIdAndUpdate(
      req.body.appointmentId,
      {
        status:'cancelled'
      }
    )
      res.status(200).json({appointments});
})

exports.checkSlot = catchAsync(async (req,res) => {
  const isSlot = await Appointment.findOne({date:req.body.appointment.date,doctor:req.body.appointment.doctor});
  if(!isSlot){
    res.status(200).json({isSlot:true});
  }
  else{
    res.status(200).json({ isSlot: false });
  }
})

exports.createAppointment =  catchAsync(async(req, res) => {
  console.log(req.body.appointment);
  const isAppointment = await Appointment.findOne({date:req.body.appointment.date,doctor:req.body.appointment.doctor});
  if(isAppointment){
    console.log(isAppointment);
    return res.json({isAvailable:false});
  }
  const userId = await User.findOne({email:req.body.appointment.userId});
  const appointment = {
    date:req.body.appointment.date,
    doctor:req.body.appointment.doctor,
    userId,
    status:req.body.appointment.status,
    fee:req.body.appointment.fee,
  }
  await Appointment.create(appointment);
  res.status(200).json({isAvailable:true});
});

exports.getCheckoutSession = catchAsync(async(req,res,next) => {
  const doctor = await Doctor.findById(req.body.doctor);
  const user = await User.findOne({email:req.body.userId});
const feeInPaise = parseInt(req.body.fee) * 100;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: req.body.userId,
    line_items: [
      {
        price_data: {
          currency: "inr",
          unit_amount: feeInPaise, // amount in paise
          product_data: {
            name: doctor.name,
            description: doctor.description,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.FRONTEND_URL}/app/appointments/appointment-booked`,
    cancel_url: `${process.env.FRONTEND_URL}/app/`,
    metadata:{
      date: req.body.dateTime,
                          doctor: req.body.doctor,
                          userId: user._id.toString(),
                          status: "upcoming",
                          fee: String(feeInPaise),
    }
  });

  res.status(200).json({session});

})

exports.removeAppointment = catchAsync(async(req, res) => {
  const appointment = await Appointment.findByIdAndDelete(req.body.id);
  res.status(200).json({isDeleted:true});
});
