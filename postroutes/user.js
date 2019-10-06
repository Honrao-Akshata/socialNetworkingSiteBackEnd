const express= require("express");
const {requiredSignin,socialSignin} = require("../controllers/auth");
const {creatUserValidator,passwordResetValidator} = require("../validators/user");
const {allUsers ,getUser,userById,updateUser,deleteUser,forgotPassword,resetPassword,userPhoto  , addFollowing,
    addFollower,
    removeFollowing,
    removeFollower,findPeople} = require("../controllers/user");
const cors = require("cors")
const router = express.Router();
//followers and following
router.put("/user/follow",cors(),requiredSignin,addFollowing,addFollower)
router.put("/user/unfollow",cors(),requiredSignin,removeFollowing,removeFollower)
router.get("/users",allUsers);
router.post("/socialSignin",socialSignin);
router.get("/user/:userId", requiredSignin , getUser);
//Whom to follow
router.get("/user/findPeople/:userId",cors(), requiredSignin , findPeople);
// photo
router.get("/user/photo/:userId", userPhoto);
//update user
router.put("/user/:userId", requiredSignin , updateUser);
//delete users
router.delete("/user/:userId", requiredSignin , deleteUser);
//Password reset
router.put("/forgotPassword",forgotPassword)
router.put("/resetPassword",passwordResetValidator,resetPassword)
router.param("userId",userById);
// console.log('router stack',router.stack)

module.exports=router;
