const express = require("express");
const app = express();
require("dotenv").config();
const cors  = require("cors");
const createUser = require("./Routes/CreateUser");
const displayData = require("./Routes/DisplayData");
const paymentRoute = require("./Routes/PaymentRoutes");

const port = 5000;

const mongoDB = require("./db");
mongoDB();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use("/api", createUser);
app.use("/api", displayData);
app.use("/api",paymentRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.get("/api/getkey",(req,res)=>{
  res.status(200).json({key:process.env.RAZORPAY_KEY_ID})
})

app.listen(port, () => {
  console.log("hi bro");
});
