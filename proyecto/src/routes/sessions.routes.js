const express = require("express");
const router = express.Router();

const passport = require("passport");
const sessionController = require("../controllers/SessionController");

// POST /api/sessions/register
router.post("/register", sessionController.register);

// POST /api/sessions/login
router.post("/login", sessionController.login);

// GET /api/sessions/current
router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  sessionController.current,
);

// POST /api/sessions/forgot-password
router.post("/forgot-password", sessionController.forgotPassword);

// POST /api/sessions/reset-password
router.post("/reset-password", sessionController.resetPassword);

module.exports = router;
