
const mongoose = require('mongoose');
// const mongoUri="mongodb://localhost:27017/inotebook"
const mongoUri="mongodb+srv://vaibhav:a12345d@vaibhav.kbcq1.mongodb.net/blog?retryWrites=true&w=majority"


const connectToMongo =async ()=>{ 
   await mongoose.connect(mongoUri ,()=>{
        console.log('connnect to mongo successfully'); })
}
module.exports=connectToMongo