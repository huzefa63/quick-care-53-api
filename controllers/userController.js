const catchAsync = require("../utils/catchAsync");
const User = require('../models/user');
exports.createUser = catchAsync(async (req, res,next) => {
    const userName = req.body.userName;
    const email = req.body.email;

    if(!userName || !email) return res.status(400).json({message:'email and username is required'});
    
    const user = await User.findOne({email});
    if(user) return;
    
    await User.create({userName,email});
    res.status(200);
});
