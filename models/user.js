const mongoose = require('mongoose');
const uuidv1 = require('uuid');
const crypto = require('crypto');
const {ObjectId} = mongoose.Schema
const userSchema = new mongoose.Schema({
  name:{
    type:String,
    trim:true,
    required:true
  },
  email:{
    type:String,
    trim:true,
    required:true
  },
  hashed_password:{
    type:String,
    required:true
  },
  salt:{
    type:String

  },
  createdDate:{
    type:Date,
    default:Date.now()
  },
  updateDate:{
    type:Date
  },
  resetPasswordLink:{
    data:String,
    default:""
  },
  photo:{
    data:Buffer,
    contentType:String
  },
  about:{
    type:String,
    trim:true
  },
  following:[{type:ObjectId,ref:"User"}],
  followers:[{type:ObjectId,ref:"User"}]
})

userSchema
.virtual('password')
.get(function(){
  return this._password
})
.set(function(password){
  //creating temp variable called _password
  this._password = password
  //generate salt
  this.salt=uuidv1()
  //encrpt the _password
  this.hashed_password=this.encrptPassword(password)
})


userSchema.methods={
  authenticate:function(plainText){
    var encr=this.encrptPassword(plainText)
    return this.encrptPassword(plainText) === this.hashed_password;
  },

  encrptPassword: function(password){
    if(!password) return "";
    try{
      const hash = crypto.createHmac('sha1', this.salt)
      .update(password)
      .digest('hex');
      return hash;
    }
    catch(err){
      return ""
    }
  }
}

module.exports = mongoose.model("User",userSchema);
