const mongoose=require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
     surname:{
            type:String,
            required:true
        }
    , email:{
        type:String,
        required:true
    },
    designation:{
        type:String,
        required:true
    },
     employeeId:{
         type:String,
         required:true
     },
     company:{
         type:String,
         required:true
     },
     password:{
         type:String,
         required:true
     }
})

module.exports=mongoose.model('User',userSchema)