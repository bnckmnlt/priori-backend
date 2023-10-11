const express = require("express");
const router = express.Router();
const {
  concludeTransaction,
  getSingleBillingRecord,
  getBillingRecord,
} = require("../controller/billing-controller");

router.post("/:userId", concludeTransaction);
router.get("/invoices/:userId", getBillingRecord);
router.get("/invoice/:userId/:transactionId", getSingleBillingRecord);

module.exports = router;
