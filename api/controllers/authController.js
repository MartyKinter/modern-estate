const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { errorHandler } = require("../utils/error");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    const user = await newUser.save();
    res.status(201).json({msg:"User created successfully", user});
  } catch (err) {
    next(err);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({email});
    if(!validUser){
      return next(errorHandler(404, 'invalid username/password'));
    }
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if(!validPassword){
      return next(errorHandler(401, 'invalid username/password'))
    }
    
    const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
    const {password: pass, ...rest} = validUser._doc;

    res.cookie('access_token', token, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
      .status(200).json(rest);
  } catch (err) {
    next(err);
  }
};

const google = async (req, res, next) => {
  try{
    const user = await User.findOne({email: req.body.email});
    if(user){
      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
      const {password: pass, ...rest} = user._doc;
      res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
    }else{
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = 
      new User({
        username: req.body.name.split(" ").join('').toLowerCase() + Math.random().toString(36).slice(-4), 
        email:req.body.email, 
        password:hashedPassword,
        avatar: req.body.photo
      });
      await newUser.save();
      const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
      const {password: pass, ...rest} = newUser._doc;
      res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
    }
  }catch(error){
    next(error);
  }
}

const signout = (req, res, next) => {
  try{
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out');
  }catch(err){
    next(err);
  }
}

module.exports = { signup, signin, google, signout };
