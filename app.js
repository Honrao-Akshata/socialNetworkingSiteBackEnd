const express = require("express");
const app = express();
const morgan=require("morgan");
const mongoose = require('mongoose');
const bodyparser=require('body-parser');
const dotenv = require('dotenv');
const expressValidator=require('express-validator');
const fs = require('fs');
const cors = require('cors');

dotenv.config();
  mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true }).then(()=>{
    console.log("succesful db connectiion");
  });
    mongoose.connection.on("error",err => {
    console.log(`${err.message}`);
  });

const postroutes=require("./postroutes/post");
const authroutes=require("./postroutes/auth");
const userroutes=require("./postroutes/user");


app.use(morgan("dev"));
app.use(cors());
app.use(bodyparser.json());
app.use(expressValidator());
app.use("/",postroutes);
app.use("/",authroutes);
app.use("/",userroutes);
app.use( function(err,req,res,next){
  if(err.names==="UnauthorizedError") {
    res.status(401).json({
      message:"Authentication required please signin"
    })
  }
})

app.get("/", (req,res) => {
  fs.readFile('../module2/Docs/routes.json',(err,data)=>{
    if(err){
      return res.status(400).json({
        message:err
      })
    }
    res.status(200).json(JSON.parse(data))
  })

})
//console.log('router stack',app._router.stack)
const port=process.env.PORT || 8080;
app.listen(port,()=>{console.log(`node js application is running on port: ${port}`)});
