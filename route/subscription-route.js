const express = require("express");
const router = express.Router();
const {
  seedSubscriptionPlan,
  getSubscriptionPlan,
} = require("../controller/subscription-controller");

router.get("/", getSubscriptionPlan);
router.post("/", seedSubscriptionPlan);

module.exports = router;
