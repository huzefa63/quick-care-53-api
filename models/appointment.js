const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    doctor:{
        required:[true,'doctor is required'],
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor',
    },
    userId:{
        required:[true,'user is required'],
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    date:String,
    status:String,
    fee:Number,
    sessionId:String,
})

const Appointment = mongoose.model('Appointment',AppointmentSchema);
module.exports = Appointment;