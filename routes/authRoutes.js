const express = require("express");
const passport = require("passport");
const User = require("../models/user");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).json({ message: "Login successful", user: req.user });
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.status(200).json({ message: "Logout successful" });
  });
});

module.exports = router;
