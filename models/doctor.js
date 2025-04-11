const mongoose = require("mongoose");
const validator = require("validator");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  speciality: { type: String, required: true },
  experience: { type: Number, required: true }, // Changed from String to Number
  rating: { type: Number, required: true },
  bio: { type: String, required: true }, // Changed from Number to String
  specialities: { type: [String], required: true }, // Defined array of strings
  location: { type: String, required: true },
  phone: {
    type: String,
    required: [true, "Please provide a phone number"],
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); // Ensuring a valid 10-digit phone number
      },
      message: "Phone number must be a valid 10-digit number",
    },
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
  },
  image:String,
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;