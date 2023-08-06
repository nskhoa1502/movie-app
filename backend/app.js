const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
// import route
const movieRoutes = require("./routes/movie");
const verifyToken = require("./middlewares/auth");

const app = express();

// Thiết lập cors để kết nối với localhost:3000
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: 200,
    methods: ["POST", "GET", "PUT", "DELETE"],
    secure: true,
    sameSite: "none",
  })
);

//bodyParser => parse các JSON file
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Sử dụng verifyToken middleware để verify các req đến từ /api/movies route
app.use("/api/movies", verifyToken, movieRoutes);

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Handle other errors
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: "Something went wrong" });
});

app.listen(5000, () => {
  console.log("Sever starts at port 5000");
});
