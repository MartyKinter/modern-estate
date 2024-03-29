const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const listingRoutes = require("./routes/listingRoutes");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xss = require("xss-clean");

const path = require("path"); // Import path module


dotenv.config();

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

const __directory = path.resolve();
const app = express();

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    imgSrc: ["'self'", "https://firebasestorage.googleapis.com"]
  }
}));
app.use(xss());
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/listing', listingRoutes);


app.use(express.static(path.join(__directory, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__directory, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
