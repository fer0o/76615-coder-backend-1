const express = require("express");
const router = express.Router();

const CurrentUserDTO = require("../dto/users/CurrentUserDTO");

const passport = require("passport");
const sessionService = require("../services/SessionService");

// POST /api/sessions/register
router.post("/register", async (req, res) => {
  try {
    const result = await sessionService.register(req.body || {});
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("Error en /register:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
});

// POST /api/sessions/login
router.post("/login", async (req, res) => {
  try {
    const result = await sessionService.login(req.body || {});
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("Error en /login:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
});

// GET /api/sessions/current
router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    const currentUser = new CurrentUserDTO(req.user);
    return res.json({
      status: "success",
      payload: currentUser,
    });
  },
);

// POST /api/sessions/forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const result = await sessionService.forgotPassword({ email: req.body?.email });
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("Error en /forgot-password:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
});

// POST /api/sessions/reset-password
router.post("/reset-password", async (req, res) => {
  try {
    const result = await sessionService.resetPassword({
      token: req.body?.token,
      newPassword: req.body?.newPassword,
    });
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    console.error("Error en /reset-password:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
});

module.exports = router;
