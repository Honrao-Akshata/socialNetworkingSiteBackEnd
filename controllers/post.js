const Post = require('../models/post')
const formidable = require('formidable')
const fs = require('fs')
const _ = require('lodash')

exports.postById = (req,res,next,id) => {
  Post.findById(id).populate('postedBy','_id name' ).
  populate('comments.postedBy','_id name').
  select('_id title body created likes comments photo').
  exec((err,post) =>{
    if(err || !post){
      res.status(400).json({
        message:"post not found",
        error:err
      })
    }
    req.post=post;
    next();
  })
}


exports.isPoster=(req,res,next)=>{
  let isPoster = req.post && req.auth._id == req.post.postedBy._id && req.auth
  if(!isPoster){
    return res.status(400).json({
      message:"User not authorized"
    })
      }
      next()
    }
    exports.deleteByPost=(req,res)=>{
  var post = req.post;

  post.remove((err,post)=>{
    if(err){
       res.status(400).json({
         message:"Post not deleted"
       })
    }
    res.status(200).json({
      post:post,
      message:"this post has been deleted"
    })
  })

}

exports.getPosts=(req ,res) =>{
  //res.json({ posts:[{ first:"AKshata"},{ second:"Honrao"}]});
  const posts = Post.find().
  populate("postedBy",("_id name")).
  populate("comments",("text created")).
  populate("comments.postedBy",("_id name")).
  select('_id title body created likes').
  sort({'created':-1}).
  then((posts)=>{
    res.status(200).json(posts)
  }).
  catch((err)=>{
    res.json({error:err})
  })
}

exports.creatPosts=(req,res,next)=> {
  var form = new formidable.IncomingForm()
  form.keepExtensions=true;
  form.parse(req,( err,fields,files)=>{
    if(err){
      res.status(400).json({
        error:"File cannot be uploaded:"
      })

    }
    let post = new Post(fields);
    // console.log("POST", req.profile)

    req.profile.hashed_password = undefined
    req.profile.salt = undefined

    post.postedBy=req.profile

    if(files.photo){
      // console.log("POST Path:", files.photo.path)
      // console.log(files.photo);
      post.photo.data=fs.readFileSync(files.photo.path)
      post.photo.ContentType=files.photo.type
    }
    post.save().then(result =>{
      return res.status(200).json({post:result});
    })
  })

  const post= new Post(req.body);
  // console.log("Post crreated:",req.body);
  post.save().then((err,result) =>{
    if(err){
      res.status(400).json({
        error:"post not saved"
      })
    }
    return res.status(200).json({post:result});
  })

}

exports.postsByUser = (req, res) => {
    Post.find({ postedBy: req.profile._id })
        .populate('postedBy', '_id name')
        .select('_id title body created likes')
        .sort('_created')
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(posts);
        });
};

// exports.updatePost=(req,res)=>{
//   let post = req.post;
//   post = _.extend(post,req.body)
//   post.updated=Date.now()
//   post.save((err,post)=>{
//     if(err){
//       return res.status(400).json({
//         message:"Post not updated"
//       })
//     }
//     res.status(200).json({
//       post:post
//     })
//   })
// }

exports.updatePost=(req ,res,next)=>{
  let form = new formidable.IncomingForm()
  form.keepExtensions =true
  form.parse(req, (err,fields ,files) =>{
    if (err) {
        return res.status(400).json({message:err,error:"image cannot be uploaded"})
    }
    let post=req.post;
    post =_.extend(post,fields)
    post.updated=Date.now()
    if(files.photo){
      post.photo.data = fs.readFileSync(files.photo.path)
      post.photo.contentType = files.photo.type
    }
    post.save((err,result)=>{
      if(err) {
        return res.status(400).json({
          error:err
        })
      }
      res.json(post)
    })
  })
};

exports.photo=(req,res,next)=>{
  res.set("Content-Type",req.post.photo.ContentType)
  return res.send(req.post.photo.data)
}

exports.singlePost=(req,res)=>{
  return res.json(req.post)
}

exports.like = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, { $push: { likes: req.body.userId } }, { new: true }).exec(
        (err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
              console.log('result in like',result)
                res.json(result);
            }
        }
    );
};

exports.unlike = (req, res) => {
  console.log("userId:", req.body.userId ,"postId:",req.body.postId);
    Post.findByIdAndUpdate(req.body.postId, { $pull: { likes: req.body.userId } }, { new: true }).exec(
        (err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                console.log('result in unlike',result)
                res.json(result);
            }
        }
    );
};


exports.comment = (req, res) => {
  let comment=req.body.comment;
  comment.postedBy=req.body.userId;
  comment.created=Date.now();
    Post.findByIdAndUpdate(req.body.postId, { $push: { comments: comment } }, { new: true }).
    populate("comments.postedBy","_id name").
    populate("postedBy","_id name").
    exec(
        (err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
              console.log('result in like',result)
                res.json(result);
            }
        }
    );
};


exports.uncomment = (req, res) => {
  let comment=req.body.comment;
  console.log(comment)
    Post.findByIdAndUpdate(req.body.postId, { $pull:  { comments: { _id: comment._id } } }, { new: true }).
    populate("comments.postedBy","_id name").
    populate("postedBy","_id name").
    exec(
        (err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
              console.log('result in like',result)
                res.json(result);
            }
        }
    );
};
