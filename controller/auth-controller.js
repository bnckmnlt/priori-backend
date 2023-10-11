const { getDB } = require("../config/db");

function createUserDocument(userId, userDetails) {
  let user = {
    _id: userId,
    role: "free",
    createdAt: new Date(),
  };

  for (let detail in userDetails) {
    user[detail] = userDetails[detail];
  }

  return user;
}

async function createUser(req, res) {
  const { userId } = req.params;
  const userDetails = req.body;
  const db = getDB();
  const usersCollection = await db.collection("users");
  const billingCollection = await db.collection("billings");

  if (!userId) {
    return res.status(403).json("The required parameter(s) is/are missing");
  }

  try {
    const userDocument = createUserDocument(userId, userDetails);
    await usersCollection.insertOne(userDocument);
    await billingCollection.insertOne({ _id: userId });

    return res.status(201).json("The user has been successfully stored");
  } catch (e) {
    if (e.code === 11000 && e.name === "MongoServerError") {
      res.status(409).json("Unable to process: user already exists");
    } else {
      console.error("Unable to process request:", e.code);
      return res.status(500).json("Internal Server Error");
    }
  }
}

async function checkUserRecord(req, res) {
  const { userId } = req.params;
  const db = getDB();
  const userCollection = await db.collection("users");

  if (!userId) {
    return res.status(403).json("The required parameter(s) is/are missing");
  }

  try {
    const checkUserRecordResult = await userCollection.findOne({
      _id: userId,
    });

    if (!checkUserRecordResult) {
      return res
        .status(201)
        .json("Error: User not found for the provided user ID");
    }

    return res.status(200).json(checkUserRecordResult);
  } catch (e) {
    console.error("Unable to process request:", e.code);
    return res.status(500).json("Internal Server Error");
  }
}

module.exports = { createUser, checkUserRecord };
