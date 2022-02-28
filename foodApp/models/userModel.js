const emailValidator = require("email-validator");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const db_link =
  "mongodb+srv://admin:ertSzx3I70MpPHYf@cluster0.otpnp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const crypto = require("crypto-js")

mongoose
  .connect(db_link)
  .then(function (db) {
    console.log("user db connected");
  })
  .catch(function (err) {
    console.log(err);
  });

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: function () {
      return emailValidator.validate(this.email);
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  confirmPassword: {
    type: String,
    required: true,
    minLength: 8,
    validate: function () {
      return this.confirmPassword == this.password;
    },
  },
  role:{
    type: String, 
    enum: ['admin','user','restaurantOwner','delieveryBoy'],
    default: 'user'
  },
  profileImage:{
    type: String,
    default: 'img/users/default.jpeg'
  },
  resetToken:String
});

//model

// (async function createUser() {
//   let user = {
//     name: "aditya shamra",
//     email: "abcd@gmail.com",
//     password: "12345678",
//     confirmPassword: "12345678",
//   };
//   let data = await userModel.create(user);
//   console.log(data);
// })();

userSchema.pre("save", function () {
  // console.log("before saving in db", this);
  this.confirmPassword = undefined;
});
// userSchema.post("save", function (doc) {
//   console.log("after s aving in db", doc);
// });
//  userSchema.pre("save", async function () {
//   let salt = await bcrypt.genSalt();
//   let hashedString = await bcrypt.hash(this.password,salt);
//   console.log(hashedString);
//   this.password = hashedString;
  
// });

userSchema.methods.createResetToken = function(){
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetToken = resetToken;
  return resetToken;
}


userSchema.methods.resetPasswordHandler = function(password,confirmPassword){
  this.password = password;
  this.confirmPassword = confirmPassword;
  this.resetToken = undefined;
}

const userModel = mongoose.model("userModel", userSchema);
module.exports = userModel;