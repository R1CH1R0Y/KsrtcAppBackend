const mongoose=require("mongoose")
let schema=mongoose.Schema(
    {
        "name":{type:String,required:true},
        "email":{type:String,required:true},
        "mob":{type:String,required:true},
        "gender":{type:String,required:true},
        "pswd":{type:String,required:true}
    }
)

let usermodel=mongoose.model("Users",schema);
module.exports={usermodel}