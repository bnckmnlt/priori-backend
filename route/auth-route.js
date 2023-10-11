const express = require("express");
const router = express.Router();
const {
  createUser,
  checkUserRecord,
} = require("../controller/auth-controller");

router.post("/:userId", createUser);
router.get("/:userId", checkUserRecord);

module.exports = router;
