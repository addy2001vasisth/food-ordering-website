const express = require("express");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const {sendMail} = require(
  '../utility/nodemailer'
)
const jwt_key = require("D:\\learning web development\\backend\\secret.js");
const { redirect } = require("express/lib/response");

//sign up user
module.exports.signup = async function signup(req, res) {
  try {
    let obj = req.body;
    let user = await userModel.create(obj);
    sendMail("signup",user);
    if (user) {
      res.json({
        message: "user signed up",
        data: user,
      });
    } else {
      res.json({
        message: "error while signing up",
      });
    }
    // console.log(obj);
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

// login user
module.exports.login = async function login(req, res) {
  try {
    let data = req.body;
    if (!data.email) {
      return res.json({
        message: "please enter email",
      });
    }
    if (!data.password) {
      return res.json({
        message: "please enter password",
      });
    }
    let user = await userModel.findOne({
      email: data.email,
    });
    console.log(user);
    if (user) {
      if (user.password === data.password) {
        let uid = user["_id"];
        let tokenJWT = jwt.sign({ payload: uid }, jwt_key);
        res.cookie("login", tokenJWT, { httpOnly: true });
        return res.json({
          message: "user has logged in",
          userDetails: data,
        });
      } else {
        return res.json({
          message: "wrong credentials",
        });
      }
    } else {
      return res.json({
        message: "USER NOT FOUND",
      });
    }
  } catch (error) {
    return res.status(502).json({
      message: error.message,
    });
  }
};

// isAuthorised -- to check the who is accessing the data

module.exports.isAuthorised =  function isAuthorised(roles) {
  return function (req, res, next) {
    if (roles.includes(req.role) == true) {
      next();
    } else {
      res.status(401).json({
        message: "operation is not allowed",
      });
    }
  };
};

// protectRoute

module.exports.protectRoute = async function protectRoute(req, res, next) {
  try {
    let token;
    if (req.cookies.login) {
      token = req.cookies.login;
      let payload = jwt.verify(token, jwt_key);
      if (payload) {
        // console.log("sdflsjkfsjf");

        const user = await userModel.findById(payload.payload);
        // console.log(user)
        req.role = user.role;
        req.id = user.id;
        next();
      } else {
        return res.json({
          message: "user not is not verified",
        });
      }
    } else {
      const client = req.get("User-Agent");
      if (client.includes("Mozilla") == true) {
        return redirect("/login");
      } else {
        res.json({
          message: "Please login again",
        });
      }
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

//forgotPassword
module.exports.forgotPassword = async function forgotPassword(req, res) {
  let { emailv } = req.body;
  try {
    const user = await userModel.findOne({ email: emailv });
    if (user) {
      const resetToken = user.createResetToken();
      let resetPasswordLink = `${req.protocol}://${req.get("host")}/resetpassword/${resetToken}`;
      // send email to the user
      // nodemailer
      let obj = {
        resetPasswordLink: resetPasswordLink,
        email: emailv
      }
      sendMail("resetpassword",obj);
    } else {
      return res.json({
        message: "please signUp",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// resetPassword
module.exports.resetPassword = async function resetPassword(req, res) {
  try {
    const token = req.params.token;
    const user = await userModel.findOne(token);
    if (!user) {
      return res.json({
        message: "user not found",
      });
    }
    let { password, confirmPassword } = req.body;
    user.resetPasswordHandler(password, confirmPassword);
    await user.save();
    res.json({
      message: "password changed succesfully",
    });
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

module.exports.logout = async function logout(req,res){
  res.cookie('login','',{maxAge:1});
  res.json({
    message:"user logged out successfully"
  })

}
