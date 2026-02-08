const bcrypt = require("bcrypt");

const saltRounds = Number(process.env.BCRYPT_SALT) || 10;

// Encripta la contraseña
const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));
};

// Compara contraseña en login
const isValidPassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = {
  createHash,
  isValidPassword,
};