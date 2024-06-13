const mongoose=require("mongoose")
let schema=mongoose.Schema(
    {
        "bname":{type:String,required:true},
        "route":{type:String,required:true},
        "bno":{type:String,required:true}
    }
)

let busmodel=mongoose.model("Buses",schema);
module.exports={busmodel}