exports.creatUserValidator =(req ,res,next) => {
  req.check("name","Write a Name").notEmpty();
  req.check("name","Name length should be between 4-150").isLength({
    min:4,max:150
  })

  req.check("email","email cannot be empty").notEmpty();
  req.check("email","email length should be between 4-32").isLength({
    min:4,max:32
  })
  req.check("email").matches(/.+\@.+\..+/)
        .withMessage('Email must contain @');

  req.check("password","password cannot be empty").notEmpty();
  req.check("password","password length should be between 8-12").isLength({
    min:8,max:12
  })

  const errors = req.validationErrors();
  if(errors){
    const firstError = errors.map(error => error.msg)[0];
    return res.status(400).json({error:firstError});
  }
  next()
}

exports.passwordResetValidator=(req,res,next)=>{
  req.check("newPassword","password cannot be empty").notEmpty();
  req.check("newPassword","password length should be between 8-12").isLength({
    min:8,max:12
  })
  const errors = req.validationErrors();
  if(errors){
    const firstError = errors.map(error => error.msg)[0];
    return res.status(400).json({error:firstError});
  }
  next()

}
