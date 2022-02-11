//Essential
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
//More Security
const trimReqBody = require("trim-request-body");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");

const cors = require("cors");
const { audit } = require("./middleware/interceptors");
//Import routes
const auth = require("./routes/auth");

const app = express();

app.set("trust proxy", true);

app.use(express.json({ limit: "50mb" }));
app.use(express.text({ limit: "50mb" }));

app.use(trimReqBody);
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(cors());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10mins
  max: 10000,
});

app.use(limiter);

//interceptors
app.use((req, res, next) => {
  res.on("finish", async () => {
    await audit(req, res);
  });
  next();
});

//Use routes
app.use("/api/v1/auth", auth);
app.use(errorHandler);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./config/config.env" });
}

connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${
      process.env.NODE_ENV ? process.env.NODE_ENV : "development"
    } mode on port ${PORT}`.yellow.bold
  )
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  server.close(() => process.exit(1));
});
