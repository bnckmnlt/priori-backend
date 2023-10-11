const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

function formatDate(timestamp) {
  const date = new Date(timestamp);

  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = date.toLocaleString("en-US", options);

  return formattedDate;
}

function getExpireDate(updatedDate, duration) {
  const estimatedDate = new Date(updatedDate);

  if (duration === "monthly") {
    estimatedDate.setMonth(estimatedDate.getMonth() + 1);
  } else if (duration === "annually") {
    estimatedDate.setFullYear(estimatedDate.getFullYear() + 1);
  } else {
    return null;
  }

  return estimatedDate.toISOString();
}

function createTransactionId(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  let transactionId = "";
  for (let i = 0; i < length; i++) {
    transactionId += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }

  return transactionId;
}

function createReferenceNumber(length) {
  const characters = "0123456789";
  const charactersLength = characters.length;
  let referenceNumber = "";
  for (let i = 0; i < length; i++) {
    referenceNumber += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }

  return referenceNumber;
}

async function createEncryptedLicense() {
  try {
    const licenseKey = uuidv4();

    const salt = await bcrypt.genSalt(12);

    const encryptedLicense = await bcrypt.hash(licenseKey, salt);

    return encryptedLicense;
  } catch (e) {
    console.error("Error creating encrypted license:", e);
    throw new Error("Failed to create encrypted license");
  }
}

async function decryptLicense() {
  return;
}

module.exports = {
  formatDate,
  getExpireDate,
  createTransactionId,
  createReferenceNumber,
  createEncryptedLicense,
  decryptLicense,
};
