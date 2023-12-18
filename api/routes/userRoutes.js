const express = require("express");
const { test, updateUser, deleteUser, 
        getUserListings, getUser } = require("../controllers/userController");
const { verifyToken } = require("../utils/verifyUser");

const app = express.Router();

app.get("/test", test);
app.post("/update/:id", verifyToken, updateUser);
app.delete("/delete/:id", verifyToken, deleteUser)
app.get('/listings/:id', verifyToken, getUserListings);
app.get('/:id', verifyToken, getUser);

module.exports = app;
