const mongoose1=require("mongoose")
const mongoose2=require("mongoose")
const cors=require("cors")
const express=require("express")
const bcrypt=require("bcryptjs")
const {usermodel}=require("./models/user")
const {busmodel}=require("./models/bus")
const jwt=require("jsonwebtoken")

const app=express()
app.use(cors())
app.use(express.json())

mongoose1.connect("mongodb+srv://Richi2001:R1CH1R0Y@cluster0.ulfkc.mongodb.net/KsrtcUserDB?retryWrites=true&w=majority&appName=Cluster0")
mongoose2.connect("mongodb+srv://Richi2001:R1CH1R0Y@cluster0.ulfkc.mongodb.net/KsrtcUserDB?retryWrites=true&w=majority&appName=Cluster0")

//User:

const generateHashedPassword=async(password)=>{
    const salt=await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
}

app.post("/signup",async(req,res)=>{
    let input=req.body
    let hashedPswd=await generateHashedPassword(input.pswd)
    input.pswd=hashedPswd
    let user=new usermodel(input)
    console.log(user)
    user.save()
    res.json({status:"success"})
})

app.post("/signin",(req,res)=>{
    let input=req.body
    usermodel.find({"email":req.body.email}).then(
        (response)=>{
            if(response.length>0){
                let dbpswd=response[0].pswd
                console.log(dbpswd)
                bcrypt.compare(input.pswd,dbpswd,(error,isMatch)=>{
                    if(isMatch){
                        jwt.sign({email:input.email},"ksrtc-app",{expiresIn:"1d"},(error,token)=>{
                            if(error){
                                res.json({status:"unable to create token"})
                            }else{
                                res.json({status:"success","user_id":response[0]._id,"token":token})
                            }
                        })
                    }else{
                        res.json({status:"incorrect password"})
                    }
                })
            }else{
                res.json({status:"incorrect email"})
            }
        }
    ).catch(
        (error)=>{
            alert(error.message)
        }
    )
})

app.post("/viewusers",(req,res)=>{
    let token=req.headers["token"]
    jwt.verify(token,"ksrtc-app",(error,decoded)=>{
        if(error){
            res.json({status:"unauthorized access"})
        }else{
            if(decoded){
                usermodel.find().then(
                    (response)=>{
                        res.json({response})
                    }
                ).catch(
                    (error)=>{
                        alert(error.message)
                    }
                )
            }
        }
    })
})

//Bus:

app.post("/add",(req,res)=>{
    let input=req.body
    let bus=new busmodel(input)
    console.log(bus)
    bus.save()
    res.json({status:"success"})
})

app.post("/search",(req,res)=>{
    let input=req.body
    busmodel.find(input).then(
        (data)=>{
            res.json(data)
        }
    ).catch()
})

app.post("/remove",(req,res)=>{
    let input=req.body
    busmodel.findByIdAndDelete(input._id).then(
        (response)=>{
            res.json({status:"success"})
        }
    ).catch(
        (error)=>{
            res.json({status:"error"})
        }
    )
})

app.post("/view",(req,res)=>{
    busmodel.find().then(
        (data)=>{
            res.json(data)
        }
    ).catch(
        (error)=>{
            alert(error.message)
        }
    )
})


app.listen(8535,()=>{
    console.log("server started")
})