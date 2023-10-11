const express = require("express");
const router = express.Router();
const {
  handleCreateOrder,
  handleCapturePayment,
} = require("../controller/paypal-controller");

router.post("/create-paypal-order", handleCreateOrder);
router.post("/capture-paypal-order", handleCapturePayment);

module.exports = router;
