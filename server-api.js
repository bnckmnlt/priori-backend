const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/db");
const {
  createOrder,
  capturePayment,
} = require("./controller/paypal-controller");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
dotenv.config();

const corsOption = require("./config/cors-option");
const credentials = require("./middleware/credentials");

const authRoute = require("./route/auth-route");
const billingRoute = require("./route/billing-route");
const licenseRoute = require("./route/license-route");
const transactionRoute = require("./route/transaction-route");
const subscriptionRoute = require("./route/subscription-route");
const userRoute = require("./route/user-route");
const paypalRoute = require("./route/paypal-route");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(credentials);
app.use(morgan("dev"));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors(corsOption));

app.use("/api/auth", authRoute);

app.use("/api/subscription", subscriptionRoute);
app.use("/api/billing", billingRoute);
app.use("/api/license", licenseRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/user", userRoute);
app.use("/api/paypal", paypalRoute);

app.all("*", (err, res) => {
  return res
    .status(err.status || 500)
    .json({ message: err.message || `Something went wrong` });
});

const PORT = process.env.PORT;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((e) => {
    console.error("Error connecting to MongoDB:", e);
  });
