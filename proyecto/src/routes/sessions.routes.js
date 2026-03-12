const express = require("express");
const router = express.Router();

const { userRepository, cartRepository } = require("../repositories");
const CurrentUserDTO = require("../dto/users/CurrentUserDTO");

const { createHash, isValidPassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");

const passport = require("passport");
const sessionService = require("../services/SessionService");

// POST /api/sessions/register
router.post("/register", async (req, res) => {
  try {
    let { first_name, last_name, email, age, password } = req.body;

    first_name = first_name?.trim();
    last_name = last_name?.trim();
    email = email?.trim().toLowerCase();

    const parsedAge = Number(age);

    if (
      !first_name ||
      !last_name ||
      !email ||
      age === undefined ||
      !password ||
      Number.isNaN(parsedAge)
    ) {
      return res.status(400).json({
        status: "error",
        message: "Faltan campos requeridos o la edad es inválida",
      });
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "El email ya está registrado",
      });
    }

    const newCart = await cartRepository.create({ products: [] });

    const newUser = await userRepository.create({
      first_name,
      last_name,
      email,
      age: parsedAge,
      password: createHash(password),
      cart: newCart._id || newCart.id,
      role: "user",
    });

    const userResponse = {
      id: newUser._id || newUser.id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      age: newUser.age,
      cart: newUser.cart,
      role: newUser.role,
    };

    return res.status(201).json({
      status: "success",
      user: userResponse,
    });
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
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email y password son requeridos",
      });
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Credenciales invalidas",
      });
    }

    const isPasswordValid = isValidPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Credenciales invalidas",
      });
    }

    const token = generateToken(user);

    return res.json({
      status: "success",
      message: "Login exitoso",
      token,
    });
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
