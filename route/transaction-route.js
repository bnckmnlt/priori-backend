const express = require("express");
const router = express.Router();
const {
  getTransaction,
  createTransaction,
} = require("../controller/transaction-controller");

router.get("/:userId", getTransaction);
router.post("/:userId", createTransaction);

module.exports = router;
