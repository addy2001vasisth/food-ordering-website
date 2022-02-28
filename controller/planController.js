const planModel = require("../models/planModel");

module.exports.getAllPlans = async function getAllPlans(req, res) {
  try {
    let plans = await planModel.find();
    if (plans) {
      return res.json({
        message: "all plans retrieved",
        data: plans,
      });
    } else {
      return res.json({
        message: "plans not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.getPlan = async function getPlan(req, res) {
  try {
    let id = req.params.id;
    let plan = await planModel.findById(id);
    if (plan) {
      return res.json({
        message: "plans retrieved",
        data: plan,
      });
    } else {
      return res.json({
        message: "plan not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.createPlan = async function createPlan(req, res) {
  try {
    let planData = req.body;
    let createdPlan = await planModel.create(planData);
    return res.json({
      message: "plan created successfully",
      data: createdPlan,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
module.exports.deletePlan = async function deletePlan(req, res) {
  try {
    let id = req.params.id;
    let deletedPlan = await planModel.findByIdAndDelete(id);
    return res.json({
      message: "plan deleted successfully",
      data: deletedPlan,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.updatePlan = async function (req, res) {
  try {
    let id = req.params.id;
    let dataToBeUpdated = req.body;
    // console.log(dataToBeUpdated);
    let keys = [];
    for(let key in dataToBeUpdated){
      keys.push(key);
    }
    let plan = await planModel.findById(id);
    console.log(plan);

    for(let i = 0; i< keys.length; i++){
      plan[keys[i]] = dataToBeUpdated[keys[i]];
    }
    console.log(plan);

    await plan.save();
    return res.json({
      message: "plan updated successfully",
      data: plan
    })
  } catch (error) {
      res.status(500).json({
        message : error.message,
      })
  }
};

// get top 3 plans on the basis of ratings

module.exports.top3Plans = async function top3Plans(req, res){
  try {
    const plans = await planModel.find().sort({
      ratingsAverage:-1
    }).limit(3);

    return res.json({
      message: 'top3 plans',
      data :plans
    })
  } catch (err) {
    
  }
}


