const express = require("express");
const { update } = require("lodash");
const app = express();
app.use(cors());
app.use(express.static("public/build"));
app.use(express.json());
const userRouter = require("./Routers/userRouter");
const authRouter = require("./Routers/authRouter");
const cookieParser = require("cookie-parser");

const planRouter = require("./Routers/planRouter");
const reviewRouter = require("./Routers/reviewRouter");
const bookingRouter = require("./Routers/bookingRouter");

const port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log(`server is listening on port ${port}`);
});
let users = [
  {
    id: 1,
    name: "aditya",
  },
  {
    id: 2,
    name: "amit",
  },
  {
    id: 3,
    name: "aman",
  },
];
app.use(cookieParser());
// middleware function;
app.use("/users", userRouter);
app.use("/plans", planRouter);
app.use("/review", reviewRouter);
app.use("/booking", bookingRouter);
