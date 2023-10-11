const { getDB, getClient } = require("../config/db");
const {
  getExpireDate,
  createEncryptedLicense,
} = require("../util/util-collection");

const transactionOptions = {
  readPreference: "primary",
  readConcern: { level: "local" },
  writeConcern: { w: "majority" },
};

function createBillingRecordDocument(transactionDetails) {
  let billingRecord = {
    status: "completed",
  };

  for (let detail in transactionDetails) {
    billingRecord[detail] = transactionDetails[detail];
  }

  return billingRecord;
}

async function concludeTransaction(req, res) {
  const { userId } = req.params;
  const transactionDetails = req.body;
  const db = getDB();
  const client = getClient();
  const billingCollection = db.collection("billings");
  const userCollection = db.collection("users");

  if (!userId || !transactionDetails) {
    return res.status(403).json("The required parameter(s) is/are missing");
  }

  const session = client.startSession();

  try {
    const getUserTransactionResult = await userCollection.findOne({
      _id: userId,
    });

    if (!getUserTransactionResult.transaction) {
      return res.status(404).json("Unable to find the user document");
    }

    const { status, ...transactionRecord } =
      getUserTransactionResult.transaction;

    if (!transactionRecord || !status) {
      return res.status(404).json("Transaction not found");
    }

    const billingDocument = createBillingRecordDocument({
      ...transactionRecord,
      ...transactionDetails,
    });

    // Start session
    const transactionResult = await session.withTransaction(async () => {
      const updateBillingRecordResult = await billingCollection.updateOne(
        {
          _id: userId,
        },
        {
          $push: {
            billingRecords: billingDocument,
          },
        },
        { session }
      );

      if (!updateBillingRecordResult) {
        console.log(
          `The transaction record matches the document(s) found in the billing collection for the user with ID: ${userId}`
        );
        await session.abortTransaction();
        return;
      }
    }, transactionOptions);

    if (transactionResult) {
      const removeTransactionResult = await userCollection.updateOne(
        { _id: userId },
        {
          $unset: { transaction: "" },
          $set: {
            role: "paid",
            subscription: {
              status: "active",
              currentPlan: {
                ...billingDocument,
                expiresAt: getExpireDate(
                  billingDocument.createdAt,
                  billingDocument.duration
                ),
              },
              license: {
                key: await createEncryptedLicense(),
                createdAt: billingDocument.createdAt,
                expiresAt: getExpireDate(
                  billingDocument.createdAt,
                  billingDocument.duration
                ),
              },
            },
          },
        }
      );

      if (removeTransactionResult.acknowledged) {
        return res.status(201).json("Payment Completed");
      } else {
        return res.status(409).json("Error removing transaction");
      }
    } else {
      return res.status(400).json("Transaction was intentionally aborted");
    }
  } catch (e) {
    console.error("Unable to process request:", e.code);
    return res.status(500).json("Internal Server Error");
  } finally {
    await session.endSession();
  }
}

async function getSingleBillingRecord(req, res) {
  const { userId, transactionId } = req.params;
  const db = getDB();
  const billingCollection = db.collection("billings");

  if (!userId || !transactionId) {
    return res.status(403).json("The required parameter(s) is/are missing");
  }

  try {
    const getSingleBillingResult = await billingCollection.findOne({
      _id: userId,
    });

    if (!getSingleBillingResult) {
      return res.status(200).json("Unable to find billing record(s)");
    }

    if (!getSingleBillingResult.billingRecords) {
      return res
        .status(404)
        .json("Unable to find document(s): billing records does not exist");
    }

    const transactionRecord = getSingleBillingResult.billingRecords.find(
      (record) => record.transactionId === transactionId
    );

    if (!transactionRecord) {
      return res.status(404).json("Unable to find transaction record");
    }

    return res.status(200).json(transactionRecord);
  } catch (e) {
    console.error("Unable to process request:", e.code);
    return res.status(500).json("Internal Server Error");
  }
}

async function getBillingRecord(req, res) {
  const { userId } = req.params;
  const db = getDB();
  const billingCollection = db.collection("billings");

  if (!userId) {
    return res.status(403).json("The required parameter(s) is/are missing");
  }

  try {
    const getBillingRecordsResult = await billingCollection.findOne({
      _id: userId,
    });

    if (!getBillingRecordsResult) {
      return res.status(404).json("Unable to find billing record(s)");
    }

    const { billingRecords } = getBillingRecordsResult;
    return res.status(200).json(billingRecords);
  } catch (e) {
    console.error("Unable to process request:", e.code);
    return res.status(500).json("Internal Server Error");
  }
}

module.exports = {
  concludeTransaction,
  getSingleBillingRecord,
  getBillingRecord,
};
