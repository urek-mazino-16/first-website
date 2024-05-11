const mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/Tour-India")
.then(()=>{
    console.log('login data mongoose connected');
})
.catch((e)=>{
    console.log('failed');
})

const logInSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const LogInCollection=new mongoose.model('Users',logInSchema)

module.exports=LogInCollection