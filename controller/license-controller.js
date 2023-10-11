const { getDB } = require("../config/db");
const { createEncryptedLicense } = require("../util/util-collection");

async function createLicense(req, res) {
  const userLicense = await createEncryptedLicense();

  return res.status(200).json();
}

async function refreshLicense(req, res) {
  return;
}

module.exports = { createLicense, refreshLicense };
