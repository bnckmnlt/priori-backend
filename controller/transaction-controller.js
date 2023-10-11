const { getDB } = require("../config/db");
const {
  createTransactionId,
  createReferenceNumber,
} = require("../util/util-collection");

function createTransactionDocument(transactionDetails) {
  let transaction = {
    transactionId: createTransactionId(16),
    referenceId: createReferenceNumber(8),
    status: "pending",
    createdAt: new Date(),
  };

  for (let detail in transactionDetails) {
    transaction[detail] = transactionDetails[detail];
  }

  return transaction;
}

async function getTransaction(req, res) {
  const { userId } = req.params;
  const db = getDB();
  const usersCollection = db.collection("users");

  if (!userId) {
    return res.status(403).json("The required parameter(s) is/are missing");
  }

  try {
    const getTransactionResult = await usersCollection.findOne({
      _id: userId,
      transaction: { $exists: true },
    });

    if (!getTransactionResult) {
      return res.status(404).json("Transaction not found");
    }

    return res.status(200).json(getTransactionResult.transaction);
  } catch (e) {
    console.error("Unable to process request:", e.code);
    return res.status(500).json("Internal Server Error");
  }
}

async function createTransaction(req, res) {
  const { userId } = req.params;
  const transactionDetails = req.body;
  const db = getDB();
  const usersCollection = db.collection("users");

  if (!transactionDetails || !userId) {
    return res.status(403).json("The required parameter(s) is/are missing");
  }

  const transactionDocument = createTransactionDocument(transactionDetails);

  try {
    const getUserRecord = await usersCollection.findOne({
      _id: userId,
    });

    if (getUserRecord) {
      const getUserTransaction = await usersCollection.findOne({
        _id: userId,
        transaction: { $exists: true },
      });

      if (getUserTransaction) {
        await usersCollection.updateOne(
          { _id: userId },
          { $set: { transaction: transactionDocument } }
        );

        return res.status(201).json("Transaction updated");
      }
      await usersCollection.updateOne(
        { _id: userId },
        { $set: { transaction: transactionDocument } }
      );

      return res.status(201).json("Transaction created");
    }

    return res.status(201).json("Unable to fetch user document");
  } catch (e) {
    console.error("Unable to process request:", e.code);
    return res.status(500).json("Internal Server Error");
  }
}

module.exports = { createTransaction, getTransaction };
