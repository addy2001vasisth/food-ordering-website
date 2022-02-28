const express = require("express");
// const protectRoute = require("./authHelper");
const userRouter = express.Router();
const {
  getUser,
  getAllUser,
  patchUser,
  deleteUser,
  updateProfileImage,
} = require("../controller/userController");
const { append } = require("express/lib/response");
const {
  signup,
  login,
  isAuthorised,
  protectRoute,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controller/authController");
// const { filter } = require("lodash");
const multer = require("multer");

// user's options
userRouter
  .route("/:id")
  // .get(getuserId)
  .patch(patchUser)
  .delete(deleteUser);

userRouter.route("/signup").post(signup);

userRouter.route("/login").post(login);
// multer for the fileupload
// upload --> storage, filter
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, `user-${Date.now()}.jpeg`);
  },
});

const filter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an Image! Please upload a valid image"), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: filter,
});

userRouter.post("/ProfileImage", upload.single("photo"), updateProfileImage);

//get request
userRouter.get("/ProfileImage", (req, res) => {
  res.sendFile("D:\\learning web development\\backend\\foodApp\\multer.html");
});
//profile page
userRouter.use(protectRoute);
userRouter.route("/userProfile").get(getUser);

// admin specific functions
userRouter.use(isAuthorised(["admin"]));
userRouter.route("/").get(getAllUser);

userRouter.route("/forgotPassword").post(forgotPassword);

userRouter.route("/resetPassword/:token").post(resetPassword);

userRouter.route("/logout").get(logout);

module.exports = userRouter;
