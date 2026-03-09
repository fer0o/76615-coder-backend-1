const express = require("express");
const router = express.Router();

const userDAO = require("../dao/mongo/UserMongoDAO");
const cartDAO = require("../dao/mongo/CartMongoDAO");
const CurrentUserDTO = require("../dto/users/CurrentUserDTO");

const { createHash, isValidPassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");

const passport = require("passport");

const crypto = require ("crypto")
const {sendResetPasswordEmail} = require ("../utils/mailer")

const hashResetToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");


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

    const existingUser = await userDAO.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "El email ya está registrado",
      });
    }

    const newCart = await cartDAO.create({ products: [] });

    const newUser = await userDAO.create({
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

    const user = await userDAO.findByEmail(email);
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
  }
);

// POST /api/sessions/forgot-password
router.post("/forgot-password", async (req, res) => {
  const genericResponse = {
    status: "success",
    message: "Si el email existe, se enviará un enlace de recuperación",
  };

  try {
    let { email } = req.body;
    email = email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email es requerido",
      });
    }

    const user = await userDAO.findByEmail(email);

    // No revelar si existe o no el correo
    if (!user) {
      return res.status(200).json(genericResponse);
    }

    if (!process.env.RESET_PASSWORD_URL) {
      console.error("Falta RESET_PASSWORD_URL en .env");
      return res.status(200).json(genericResponse);
    }

    // token real para link + token hasheado para DB
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = hashResetToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

    await userDAO.setResetToken(user._id || user.id, hashedToken, expiresAt);

    const resetLink = `${process.env.RESET_PASSWORD_URL}?token=${encodeURIComponent(
      rawToken
    )}`;

    // si falla el mail, igual responder genérico
    try {
      await sendResetPasswordEmail({
        to: user.email,
        resetLink,
      });
    } catch (mailError) {
      console.error("Error enviando mail de recuperación:", mailError.message);
    }

    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error("Error en /forgot-password:", error.message);
    return res.status(200).json(genericResponse);
  }
});


// POST /api/sessions/reset-password
router.post("/reset-password", async (req, res) => {
  try {
    let { token, newPassword } = req.body;

    token = token?.trim();
    newPassword = newPassword?.trim();

    if (!token || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "Token y nueva contraseña son requeridos",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        status: "error",
        message: "La nueva contraseña debe tener al menos 8 caracteres",
      });
    }

    // El token se busca hasheado (no se guarda en texto plano)
    const hashedToken = hashResetToken(token);
    const user = await userDAO.findByResetToken(hashedToken);

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Token inválido o expirado",
      });
    }

    // Evitar reutilizar la misma contraseña anterior
    const sameAsOldPassword = isValidPassword(newPassword, user.password);
    if (sameAsOldPassword) {
      return res.status(400).json({
        status: "error",
        message: "La nueva contraseña no puede ser igual a la anterior",
      });
    }

    const newHashedPassword = createHash(newPassword);

    await userDAO.updatePasswordAndClearReset(
      user._id || user.id,
      newHashedPassword
    );

    return res.status(200).json({
      status: "success",
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    console.error("Error en /reset-password:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
});






module.exports = router;