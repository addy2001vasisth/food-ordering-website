let SK =
  "sk_test_51KXkogSEYW2xeLv3854pibGqi91n23jmsDvNUj6nEMrec8QopCAr7H8Eivmsjy7EopXH2FrlfleQKKL4Y0bh9Yfr00XvCz4ZKM";
const stripe = require("stripe")(SK);

const planModel = require("../models/planModel");
const userModel = require("../models/userModel");

module.exports.createSession = async function createSession(req, res) {
  try {
    let userId = req.id;
    let planid = req.params.id;
    const user = await userModel.findById(userId);
    const plan = await planModel.findById(planid);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: user.email,
      client_reference_id: plan.id,

      line_items: [
        {
          name: plan.name,
          description: plan.description,
          amount: plan.price * 100,
          currency: "inr",

          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell

          quantity: 1,
        },
      ],

      success_url: `${req.protocol}/${req.get("host")}/profile`,
      cancel_url: `${req.protocol}/${req.get("host")}/profile`,
    });

    res.status(200).json({
      status: "success",
      session,
    });
  } catch (err) {
    return res.status(401).json({
      message: err.message,
    });
  }
};
