const express = require("express");
const router = express.Router();
const {
  createLicense,
  refreshLicense,
} = require("../controller/license-controller");

router.post("/:userId", createLicense);
router.get("/:userId", refreshLicense);

module.exports = router;
