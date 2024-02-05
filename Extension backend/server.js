const express = require("express");
const app = express()
const mongoose = require("mongoose")
const Cookie = require("./models/productModel")
app.use(express.json())
//Routes

app.get("/",(req,res)=>{
    res.send("Hello Node API")
}
)
app.get("/Blog",(req,res)=>{
    res.send("Hello Blog")
})

app.get("/cookies",async (req,res)=>{
    try {
        const cookies = await Cookie.find({});
        res.status(200).json(cookies) 
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.post("/cookies",async (req,res)=>{
    try {
        const cookie = await Cookie.create(req.body)
        res.status(200).json(cookie);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:error.message})
    }
})



// mongoose.set("strictQuery",false)
mongoose.
connect("mongodb+srv://cookieManager:tzj5qE5F2dfw5kSL@cookiemanager.bjliluc.mongodb.net/Cookie-Manager?retryWrites=true&w=majority")
.then(()=>{
    app.listen(3000, ()=>{
        console.log("Node app is running on port 3000")
    })
    console.log("Connected to database")
}).catch((error)=>{
    console.log(error)
})