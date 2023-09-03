require("dotenv").config();
const { config } = require("dotenv");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

// server
const app = express();

//middleware
app.use(cors());
app.use(express.json());

// routes
const marvelRouter = require("./routes/marvel");
const userRouter = require("./routes/user");
const favoriteRouter = require("./routes/favorite");

// cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// mongodb
mongoose.connect(process.env.MONGODB_URI);
// mongoose.connect(process.env.MONGODB_URI_LOCAL);

app.get("/", (req, res) => {
  res.status(200).json("Welcome to Marvel app api !");
});

// marvel routes
app.use(marvelRouter);

// user routes
app.use(userRouter);

// favorite routes
app.use(favoriteRouter);

app.all("*", (req, res) => {
  res.status(404).json({ message: "Service/route not found." });
});

app.listen(process.env.PORT, () => {
  console.log("👍 Server started on PORT => " + process.env.PORT);
});
