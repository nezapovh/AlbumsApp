const express = require("express");
require("express-async-errors");
const albumsRouter = require("./routes/albumsRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorMiddleware");
require("dotenv").config();

const passport = require("passport");
require("./config/passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const config = require("./utils/config");

const app = express();

const mongoose = require("mongoose");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use(express.json());

app.use(
  session({
    secret: "SESSION_SECRET",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: config.MONGODB_URI }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/albums", albumsRouter);

app.use(errorHandler);

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`);
// });

module.exports = app;
