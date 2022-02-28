const planModel = require("../models/planModel");
const reviewModel = require("../models/reviewModel");
// const planModel = require("../models/planModel")

module.exports.getAllReviews = async function getAllReviews(req, res) {
  try {
    const reviews = await reviewModel.find();
    if (reviews) {
      return res.json({
        message: "reviews retrieved",
        data: reviews,
      });
    } else {
      return res.json({
        message: "reviews not found",
      });
    }
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};

module.exports.top3reviews = async function top3reviews(req, res) {
  try {
    const reviews = await reviewModel
      .find()
      .sort({
        rating: -1,
      })
      .limit(3);
    if (reviews) {
      return res.json({
        message: "reviews retrieved",
        data: reviews,
      });
    } else {
      return res.json({
        message: "reviews not found",
      });
    }
  } catch (err) {}
};

module.exports.getPlanReviews = async function getPlanReviews(req, res) {
  try {
    const planid = req.params.id;

    let reviews = await reviewModel.find();
    reviews = reviews.filter((review) => review.plan._id == planid);
    if (reviews) {
      return res.json({
        message: "reviews retrieved",
        data: reviews,
      });
    }
    else{
      return res.json({
        message: 'reviews not found'
      })
    }
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};

module.exports.createReview = async function createReview(req, res) {
  try {
    let id = req.params.plan;
    let plans = await planModel.findById(id);
    let review = await reviewModel.create(req.body);
    plans.ratingsAverage =
      (plans.ratingsAverage * plans.noOfReview + review.rating) /
      (plans.noOfReview + 1);
    plans.noOfReview++;
    await plans.save();
    res.json({
      message: "review created",
      data: review,
    });
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};

module.exports.updateReview = async function updateReview(req, res) {
  try {
    let planid = req.params.id;
    //review id from front end
    let id = req.body.id;

    let review = await reviewModel.findById(id);
    let dataToBeUpdated = req.body;
    // console.log(dataToBeUpdated);
    let keys = [];
    for (let key in dataToBeUpdated) {
      if(key == 'id') continue; 
      keys.push(key);
    }

    for (let i = 0; i < keys.length; i++) {
      review[keys[i]] = dataToBeUpdated[keys[i]];
    }

    await review.save();
    return res.json({
      message: "plan updated successfully",
      data: review,
    });
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};

module.exports.deleteReview = async function deleteReview(req, res) {
  try {
    let planid = req.params.id;
    // review id from front end
    let id = req.body.id;
    let review = await reviewModel.findByIdAndDelete(id);

    res.json({
      message: "review deleted",
      data: review,
    });
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};
