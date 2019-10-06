const mongoose= require("mongoose");
const { ObjectId }=mongoose.Schema
var postSchema = mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  body:{
    type:String,
    required:true
  },
  photo:{
    data:Buffer,
    ContentType:String
  },
  postedBy:{
    type:ObjectId,
    ref:"User"
  },
  created:{
    type: Date ,
    default: Date.now
  },
  updated:{
    type:Date
  },
  likes: [{ type: ObjectId, ref: 'User' }],
  comments: [{
     text:String,
     created:{type:Date,default:Date.now},
     postedBy:{ type: ObjectId, ref: 'User' }
    }]
})

const post = mongoose.model("post",postSchema)
module.exports = post;
