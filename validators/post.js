exports.creatPostsValidator =(req ,res,next) => {
  req.check("title","Write a title").notEmpty();
  req.check("title","Title length should be between 4-150").isLength({
    min:4,max:150
  })

  req.check("body","Write a body").notEmpty();
  req.check("body","body length should be between 4-2000").isLength({
    min:4,max:2000
  })

  const errors = req.validationErrors();
  if(errors){
    const firstError = errors.map(error => error.msg)[0];
    return res.status(400).json({error:firstError});
  }
  next()
}
