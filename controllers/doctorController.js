const catchAsync = require("../utils/catchAsync");
const Doctor = require('../models/doctor');
exports.getAllDoctors = catchAsync(async (req, res,next) => {
    const doctors = await Doctor.find();
    res.json({doctors});
});

exports.getDoctor = catchAsync(async (req, res,next) => {
    const doctor = await Doctor.find({_id:req.body.id});
    console.log(doctor);
    res.json({doctor});
});