const { getDB } = require("../config/db");

const createSubscriptionPlansDocument = {
  _id: "PRIORIPOS",
  monthly: [
    {
      planId: "REPOS0844",
      planName: "Retail POS",
      value: 45.0,
      duration: "monthly",
      itemList: [
        {
          standard: "Standard Features",
          standard_list: [
            "Dashboard",
            "Sales Recording",
            "Retail User Interface",
            "User-Friendly Reports",
            "User Access Levels",
            "Customizable Logo",
          ],
          additional: "Additional Features",
          additional_list: ["Cloud-based", "Product Expiry", "Networking"],
        },
      ],
    },
    {
      planId: "RTPOS0845",
      planName: "Restaurant POS",
      value: 50.0,
      duration: "monthly",
      itemList: [
        {
          standard: "Standard Features",
          standard_list: [
            "Dashboard",
            "Sales Recording",
            "Restaurant User Interface",
            "User-Friendly Reports",
            "User Access Levels",
            "Customizable Logo",
          ],
          additional: "Additional Features",
          additional_list: [
            "Ingredients Inventory",
            "Cloud-based",
            "Product Expiry",
            "Networking",
          ],
        },
      ],
    },
  ],
  annual: [
    {
      planId: "REPOS0820",
      planName: "Retail POS",
      value: 486.0,
      duration: "annually",
      itemList: [
        {
          standard: "Standard Features",
          standard_list: [
            "Dashboard",
            "Sales Recording",
            "Retail User Interface",
            "User-Friendly Reports",
            "User Access Levels",
            "Customizable Logo",
          ],
          additional: "Additional Features",
          additional_list: ["Cloud-based", "Product Expiry", "Networking"],
        },
      ],
    },
    {
      planId: "RTPOS0821",
      planName: "Restaurant POS",
      value: 510.0,
      duration: "annually",
      itemList: [
        {
          standard: "Standard Features",
          standard_list: [
            "Dashboard",
            "Sales Recording",
            "Restaurant User Interface",
            "User-Friendly Reports",
            "User Access Levels",
            "Customizable Logo",
          ],
          additional: "Additional Features",
          additional_list: [
            "Ingredients Inventory",
            "Cloud-based",
            "Product Expiry",
            "Networking",
          ],
        },
      ],
    },
  ],
};

const seedSubscriptionPlan = async (req, res, next) => {
  const db = getDB();

  try {
    const result = await db
      .collection("subscriptions")
      .updateOne(
        { _id: createSubscriptionPlansDocument._id },
        { $set: createSubscriptionPlansDocument },
        { upsert: true }
      );

    console.log(
      `${result.matchedCount} document(s) matched the query criteria.`
    );

    if (result.upsertedCount > 0) {
      console.log(`One document was inserted with the id ${result.upsertedId}`);
      return res.status(200).json("Plans seededed successfully");
    } else {
      console.log(`${result.modifiedCount} document(s) was/were updated.`);
      return res.status(200).json("Plans seededed successfully");
    }
  } catch (e) {
    console.error(e);
  }
};

const getSubscriptionPlan = async (req, res) => {
  const db = getDB();

  try {
    seedSubscriptionPlan();
    const result = await db
      .collection("subscriptions")
      .findOne({ _id: createSubscriptionPlansDocument._id });

    const { _id, ...subscriptionPlan } = result;

    return res.status(200).json(subscriptionPlan);
  } catch (e) {
    return res.status(500).json(e);
  }
};

module.exports = { getSubscriptionPlan, seedSubscriptionPlan };
