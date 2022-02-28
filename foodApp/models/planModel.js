// mongoose

const mongoose = require("mongoose");
const db_link =
  "mongodb+srv://admin:ertSzx3I70MpPHYf@cluster0.otpnp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose
  .connect(db_link)
  .then(function (db) {
    console.log("plan db connected");
  })
  .catch(function (err) {
    console.log(err);
  });

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: [20,'plan name should not exceed more than 20 characters']
  },
  duration: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: [true,'price not enter']
  },
  ratingsAverage: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    validate: [function () {
      this.discount < 100;
    },'discount should not exceed price']

  },
  noOfReview:{
    type : Number,
    default: 0
  }

});
const planModel = mongoose.model("planModel",planSchema);

// (async function createPlane(){
//     let planObj = {
//         name:'SuperFood110',
//         duration:30,
//         price:1000,
//         ratingsAverage:5,
//         discount:20
//     }
//     const doc = new planModel(planObj);
//     await doc.save();
//     // let data = await planModel.create(planObj);
//     // console.log(data);
// })();


module.exports = planModel;

