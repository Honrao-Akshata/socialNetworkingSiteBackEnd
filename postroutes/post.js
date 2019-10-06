const express= require("express");
const {getPosts, creatPosts,photo,postsByUser,postById,isPoster,deleteByPost,updatePost,singlePost,like,unlike,comment,uncomment} = require("../controllers/post");
const {creatPostsValidator} = require("../validators/post");
const {signup,requiredSignin} = require("../controllers/auth");
const {creatUserValidator} = require("../validators/user");
const {userById} = require("../controllers/user");
const router = express.Router();
// router.get("/",api);
router.post("/signup", creatUserValidator, signup);
router.get("/posts",getPosts);
router.put("/post/like", requiredSignin,like);
router.put("/post/unlike", requiredSignin,unlike);
router.put("/post/comment", requiredSignin,comment);
router.put("/post/uncomment", requiredSignin,uncomment);
router.param("userId",userById);
router.param("postId",postById);
router.post("/post/:userId", requiredSignin, creatPosts,creatPostsValidator);
router.get("/post/by/:userId", requiredSignin, postsByUser);
router.get("/post/photo/:postId", photo);
router.delete("/post/:postId",requiredSignin,isPoster,deleteByPost);
router.get("/post/:postId",singlePost);
router.put("/post/:postId", requiredSignin,isPoster,updatePost);



module.exports=router;
