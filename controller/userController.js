const userModel = require("../models/userModel");

module.exports.getUser = async function getUser(req, res) {
  // let allUsers = await userModel.find();
  try {
    let id = req.id;
    console.log(id);
    let oneUser = await userModel.findById(id);
    if (oneUser) {
      return res.json({ oneUser });
    } else {
      return res.json({
        message: "Please Login",
      });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};
// module.exports.postUser = function postUser(req, res) {
//   console.log(req.body);
//   users = req.body;
//   //   console.log(users);
//   res.json({
//     message: "data received successfully",
//     users: req.body,
//   });
// }
module.exports.patchUser = async function patchUser(req, res) {
  try {
    // console.log(req.body);
    //update data in users obj
    let id = req.params.id;
    let user = await userModel.findById(id);
    let dataToBeUpdated = req.body;
    if (user) {
      const keys = [];
      for (let key in dataToBeUpdated) {
        keys.push(key);
      }
      for (let i = 0; i < keys.length; i++) {
        user[keys[i]] = dataToBeUpdated[keys[i]];
      }
      user['confirmPassword'] = user['password'];
      const updated = await user.save();


      return res.json({
        message: "data updated successfully",
        data: user,
      });
    } else {
      res.json({
        message: "user not found",
      });
    }
  }  catch (err) {
    // console.log(err.message)
    res.json({
      message: err.message,
    });
  }
};
module.exports.deleteUser = async function deleteUser(req, res) {
  try {
    let id = req.params.id;
    // let userToBeDeleted = req.body;
    let user = await userModel.findByIdAndDelete(id);
    if (!user) {
      res.json({
        message: "user has not found",
      });
    }
    res.json({
      message: "user has been deleted",
      data: user,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

module.exports.getAllUser = async function getuserId(req, res) {
  try {
    let users = await userModel.find();
    if (users) {
      res.json({
        message: "users retreived",
        data: users,
      });
    } else {
      res.json({
        message: "no users found",
      });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

module.exports.updateProfileImage= function updateProfileImage(req,res){
  return res.json({
    message: 'file uploaded successfully'
  })
}

// function setCookies(req, res) {
//   // res.setHeader("Set-Cookie","isLoggedIn=true");
//   res.cookie("isLoggedIn", true, {
//     maxAge: 1000 * 60 * 60 * 24,
//     secure: true,
//     httpOnly: true,
//   });
//   res.cookie("isPrimeMemeber", true);

//   res.send("cookies has been set ");
// }

// function getCookies(req, res) {
//   let cookies = req.cookies.isPrimeMemeber;
//   console.log(cookies);
//   res.send("cookies has been received");
// }
