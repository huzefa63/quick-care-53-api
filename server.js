const app = require('./app');
const mongoose = require('mongoose');
const Doctor = require('./models/doctor');

(async function(){
    try{
    await mongoose.connect(process.env.MONGO_URI);
        console.log('connected');
    }catch(err){
        console.log('failed');
    }
}())




app.listen(process.env.PORT,()=>{
    console.log('listening');
})