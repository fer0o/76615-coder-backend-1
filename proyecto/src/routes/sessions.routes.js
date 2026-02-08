const express = require("express");
const router = express.Router();

const UserModel = require("../models/User.model");
const CartModel = require("../models/Cart.model");
const { createHash, isValidPassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");

const passport = require("passport");

// POST /api/sessions/register
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    // Validación mínima
    if (!first_name || !last_name || !email || age === undefined || !password) {
      return res.status(400).json({ status: "error", message: "Faltan campos requeridos" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: "error", message: "El email ya está registrado" });
    }

    // Crear carrito vacío
    const newCart = await CartModel.create({ products: [] });

    // Crear usuario con password hasheado
    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      cart: newCart._id,
      role: "user",
    });

    // No devolvemos password
    const userResponse = {
      id: newUser._id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      age: newUser.age,
      cart: newUser.cart,
      role: newUser.role,
    };

    return res.status(201).json({ status: "success", user: userResponse });
  } catch (error) {
    console.error("Error en /register:", error.message);
    return res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
});

//POST /api/sessions/login
router.post("/login", async (req, res) => {
    try{
        const {email, password} = req.body;
        //validar que existan los campos 
        if(!email || !password){
            return res.status(400).json({
                status: "error",
                message: "Email y password son requeridos"
            })
        }
        //buscar el usuario
        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(401).json({
                status: "error",
                message:"Credenciales invalidas",
            });
        }
        const isPasswordValid = isValidPassword(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({
                status: "error",
                message:"Credenciales invalidas",
            });
        }
        //generamos token
        const token = generateToken(user);

        return res.json({
            status: "success",
            message: "Login exitoso",
            token,
        });
    }
    catch(error){
        console.error( "Error en /login:", error.message);
        return res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
});

// GET /api/sessions/current
router.get("/current", passport.authenticate("jwt", { session: false }),
    (req, res) => {
        return res.json({
            status: "success",
            payload: req.user
        })
    }
);

module.exports = router;