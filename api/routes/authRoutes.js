const express = require("express");
const { signup, signin, google, signout } = require("../controllers/authController");

const app = express.Router();

app.post("/signup", signup);
app.post("/signin", signin);
app.post("/google", google);
app.get('/signout', signout);

module.exports = app;
