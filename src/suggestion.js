const mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/Tour-India")
.then(()=>{
    console.log('suggestion data mongoose connected');
})
.catch((e)=>{
    console.log('failed');
    console.log(e);
})

const suggestionSchema=new mongoose.Schema({
    username:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    place:{
        type:String,
        required:true
    },
    placedescription:{
        type:String,
        required:true
    },
    placeurl:{
        type:String,
        required:true
    },
    fest:{
        type:String,
        required:true
    },
    festdescription:{
        type:String,
        required:true
    },
    festurl:{
        type:String,
        required:true
    }
})

const suggestion=new mongoose.model('suggestions',suggestionSchema)

module.exports=suggestion