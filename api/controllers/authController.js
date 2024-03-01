const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { errorHandler } = require("../utils/error");
const jwt = require("jsonwebtoken");
const { sendResetEmail } = require("../utils/sendEmail");

const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    const user = await newUser.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    next(err);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(401, 'invalid username/password'));
    }
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, 'invalid username/password'))
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;

    res.cookie('access_token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
      .status(200).json(rest);
  } catch (err) {
    next(err);
  }
};

const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc; //separates password out of the rest of the data
      res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest); //sends rest of data without password
    } else {
      //since we got the info from Google this generates a random 16 digit password for the user
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser =
        new User({
          //if there are spaces in the name from Google, remove them and join w/o space then add 4 random numbers to the end
          //to ensure name is unique
          username: req.body.name.split(" ").join('').toLowerCase() + Math.random().toString(36).slice(-4),
          email: req.body.email,
          password: hashedPassword,
          avatar: req.body.photo
        });
      const user = await newUser.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc; //remove password from rest of data
      res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest); //send rest of data w/o password
    }
  } catch (error) {
    next(error);
  }
}

const signout = (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out');
  } catch (err) {
    next(err);
  }
}

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ sucess: false, message: "Please enter a vaild email" });
  }
  try {
    await sendResetEmail(email);
    res.status(200).json({ message: 'Email sent for password reset' });
  } catch (err) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyToken = async (req, res, next) => {
  const { token } = req.query;

  if (!token) {
    return next(errorHandler(404, 'Invalid token no token'));
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(errorHandler(400, `Invalid token in decode`));
  }

  const oldUser = await User.findById(decodedToken.userId);

  if (!oldUser) {
    return next(errorHandler(400, 'User not found'));
  }

  res.status(200).json({ success: true, data: decodedToken.userId });

}

const resetPassword = async (req, res, next) => {
  const { userId, newPassword, confirmNewPassword } = req.body;

  if (!userId || !confirmNewPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "Please enter all fields" })
  }

  const oldUser = await User.findById(userId);

  if (!oldUser) {
    return res.status(400).json({ success: false, message: "user not found" });
  }

  if (confirmNewPassword !== confirmNewPassword) {
    return next(errorHandler(401, 'Passwords do not match'))
  }

  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  const updatedUser = await User.findByIdAndUpdate(userId, {
    $set: {
      password: hashedPassword
    }
  });

  if (updatedUser) {
    res.status(200).json({ success: true, message: "password updated successfully" })
  } else {
    res.status(500).json({ success: true, message: "something went wrong" })
  }

}



module.exports = {
  signup, signin, google, signout,
  forgotPassword, resetPassword, verifyToken
};
