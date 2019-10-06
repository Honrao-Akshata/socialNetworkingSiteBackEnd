const express= require("express");
const {signup,signin,signout} = require("../controllers/auth");
const {creatUserValidator} = require("../validators/user");
const {userById,allUsers} = require("../controllers/user");
const router = express.Router();

router.post("/signup", creatUserValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);
// router.get("/users",allUsers);
// //Any routes conatining userid will execute userBYId methods
// router.param("userId",userById);


module.exports=router;
