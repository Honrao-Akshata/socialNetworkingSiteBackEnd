const User = require('../models/user')
const jwt = require('jsonwebtoken')
const cookie = require("cookie-parser")
const expressJwt = require("express-jwt")
const _ = require("lodash")
const formidable = require('formidable')
const fs = require('fs')
const {sendEmail} = require('../helpers/index')

require('dotenv').config;

exports.resetPassword=(req,res)=>{
  const { resetPasswordLink , newPassword}=req.body
  User.findOne({resetPasswordLink},(err,user)=>{
    if(err || !user){
      res.status(400).json({
        message:"user in system not found"
      })
    }
    const updatedFields = {
           password: newPassword,
           resetPasswordLink: ""
       };
    user = _.extend(user,updatedFields)
    user.updated = Date.now();
 user.save((err,result)=>{
   if(err){
     res.status(400).json({
       message:"email address not  found"
     })
   }
   res.status(200).json({
     user:result
   })
 })
})
}

exports.forgotPassword= (req,res) => {
  const email = req.body.email;
  console.log("email address: ",email)
  if(!email){
    res.status(400).json({
      message:"Please enter an email address"
    })
  }

  User.findOne( {email} , (err,user) => {
    if(err || !user){
      res.status(400).json({
        message:"email address not  found"
      })
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN);

    const emailData = {
      from: "honraoakshata@gmail.com",
      to: email,
      subject: "Password Reset Instructions",
      text: `Please use the following link to reset your password: ${
        process.env.CLIENT_URL
      }/reset-password/${token}`,
      html: `<p>Please use the following link to reset your password:</p> <p>${
        process.env.CLIENT_URL
      }/reset-password/${token}</p>`
    };

    return user.updateOne( {resetPasswordLink:token} ,(err,success)=>{
      if(err){
        res.status(400).json({
          message:"email address not  found"
        })

      }else{
        sendEmail(emailData)
        res.status(200).json({
        message:"Mail has been sent"
        })
      }
    })

  })
}

exports.userById = (req, res,next,id) => {
  console.log("Id in userById",id)
  User.findById(id).populate('following',"_id name").populate('followers',"_id name").exec((err,user) =>{
    if(err || !user){
      res.status(400).json({
        message:"user in useByID not found",
        error:err
      })
    }

    req.profile=user;
    next();
  })
}

exports.allUsers = (req,res) =>{
  User.find((err,users) =>{
    if(err){
      res.status(400).json({
        message : "Users not found"
      });
    }
    res.status(200).json(users  )
  }).select("name email createdDate updateDate");

}

exports.getUser = (req,res) =>{
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(  req.profile );
}

// exports.addFollowers =(req,res,next)=>{
//   console.log("useId:",req.body.userId,"followId:",req.body.followId)
//   User.findByIdAndUpdate(
//     req.body.followId,{ $push: { followers: req.body.userId } },{new:true}
//   ).populate('followers','name _id').populate('following','name _id') .exec((err,result)=>{
//     if(err){
//       return res.status(400).json({error:err})
//     }
//     result.hashed_password="undefined"
//     result.salt="undefined"
//     res.json(result)
//   })
// }
//
// exports.removeFollower =(req,res,next)=>{
//   console.log("useId:",req.body.userId,"followId:",req.body.followId)
//   User.findByIdAndUpdate(
//     req.body.unfollowId,{ $pull: { followers: req.body.userId } },{new:true}
//   ).populate('followers','name _id').populate('following','name _id') .exec((err,result)=>{
//     if(err){
//       return res.status(400).json({error:err})
//     }
//     result.hashed_password="undefined"
//     result.salt="undefined"
//     res.json(result)
//   })
// }
//
// exports.addFollowing =(req,res,next)=>{
//   console.log("useId:",req.body.userId,"followId:",req.body.followId)
//   User.findByIdAndUpdate(
//     req.body.userId,{ $push: { following: req.body.followId } },(err,result)=>{
//         if(err){
//           return res.status(400).json({message:"ObjectId",error:err})
//         }
//           return res.status(200).json({message:"follower added"})
//     }
//   )
//   next();
// }
//
// exports.removeFollowing =(req,res,next)=>{
//   User.findByIdAndUpdate(
//     req.body.userId,{ $pull: { following: req.body.followId } },(err,result)=>{
//         if(err){
//           return res.status(400).json({error:err})
//         }
//     }
//   )
//   next();
// }


exports.hasAuthorization =(req ,res,next)=>{
  const authorized = req.profile && req.auth && req.auth._id === req.profile._id
  if(!authorized){
    res.status(403).json({
      message:"User not authorized"
    })
  }
}

// exports.updateUser = (req,res) =>{
//   let user = req.profile
//   user = _.extend(user,req.body)
//   user.save((err) => {
//
//     if(err){
//       console.log("Inside Error")
//       return res.status(403).json({
//         message:"User not authorized",
//         error:"User not authorized"
//       })
//     }
//     user.updateDate=Date.now()
//     user.hashed_password = undefined
//     user.salt = undefined
//     res.json(  user );
//   })
//
// }
// follow unfollow
exports.addFollowing = (req, res, next) => {
    User.findByIdAndUpdate(req.body.userId, { $push: { following: req.body.followId } }, (err, result) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        next();
    });
};

exports.addFollower = (req, res) => {
    User.findByIdAndUpdate(req.body.followId, { $push: { followers: req.body.userId } }, { new: true })
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            res.json(result);
        });
};

// remove follow unfollow
exports.removeFollowing = (req, res, next) => {
    User.findByIdAndUpdate(req.body.userId, { $pull: { following: req.body.unfollowId } }, (err, result) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        next();
    });
};

exports.removeFollower = (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, { $pull: { followers: req.body.userId } }, { new: true })
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            res.json(result);
        });
};
exports.updateUser=(req ,res,next)=>{
  let form = new formidable.IncomingForm()
  form.keepExtensions =true
  form.parse(req, (err,fields ,files) =>{
    if (err) {
        return res.status(400).json({message:err,error:"image cannot be uploaded"})
    }
    let user=req.profile;
    user =_.extend(user,fields)
    user.updated=Date.now()
    if(files.photo){
      user.photo.data = fs.readFileSync(files.photo.path)
      user.photo.contentType = files.photo.type
    }
    user.save((err,result)=>{
      if(err) {
        return res.status(400).json({
          error:err
        })
      }
      user.hashed_password=undefined
      user.salt=undefined
      res.json(user)
    })
  })
};

exports.userPhoto = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set(('Content-Type', req.profile.photo.contentType));
        return res.send(req.profile.photo.data);
    }
    next();
};


exports.deleteUser = (req,res) =>{
  let user = req.profile
  user.remove((err,user)=>{
    if(err){
      return res.status(400).json({message:"User cannot be deleted",
      user:user})
    }
    return res.json({
      message:"deleted User",
      user:user
    })
  })

}

exports.findPeople =(req,res)=>{
  let following = req.profile.following;
  following.push(req.profile._id)
  User.find( {_id: {$nin :following}}, (err,users) => {
    if(err){
      return res.status(400).json({error:err})
    }
    res.status(200).json(users)
  }).select("name")
}
