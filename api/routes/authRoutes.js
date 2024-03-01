const express = require("express");
const { signup, signin, google, signout, forgotPassword, resetPassword, verifyToken } = require("../controllers/authController");

const app = express.Router();

app.post("/signup", signup);
app.post("/signin", signin);
app.post("/google", google);
app.get('/signout', signout);
app.post('/forgot-password', forgotPassword);
app.post('/reset-password', resetPassword);

app.get('/verifyToken', verifyToken);


module.exports = app;
