const crypto = require("crypto");
const { userRepository, cartRepository } = require("../repositories");
const { createHash, isValidPassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");
const { sendResetPasswordEmail } = require("../utils/mailer");

const hashResetToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

class SessionService {
  async register({ first_name, last_name, email, age, password }) {
    try {
      const cleanFirstName = first_name?.trim();
      const cleanLastName = last_name?.trim();
      const cleanEmail = email?.trim().toLowerCase();
      const parsedAge = Number(age);

      if (
        !cleanFirstName ||
        !cleanLastName ||
        !cleanEmail ||
        age === undefined ||
        !password ||
        Number.isNaN(parsedAge)
      ) {
        return {
          statusCode: 400,
          body: {
            status: "error",
            message: "Faltan campos requeridos o la edad es inválida",
          },
        };
      }

      const existingUser = await userRepository.findByEmail(cleanEmail);
      if (existingUser) {
        return {
          statusCode: 409,
          body: {
            status: "error",
            message: "El email ya está registrado",
          },
        };
      }

      const newCart = await cartRepository.create({ products: [] });

      const newUser = await userRepository.create({
        first_name: cleanFirstName,
        last_name: cleanLastName,
        email: cleanEmail,
        age: parsedAge,
        password: createHash(password),
        cart: newCart._id || newCart.id,
        role: "user",
      });

      return {
        statusCode: 201,
        body: {
          status: "success",
          user: {
            id: newUser._id || newUser.id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            age: newUser.age,
            cart: newUser.cart,
            role: newUser.role,
          },
        },
      };
    } catch (error) {
      console.error("Error en register:", error.message);
      return {
        statusCode: 500,
        body: {
          status: "error",
          message: "Error interno del servidor",
        },
      };
    }
  }

  async login({ email, password }) {
    try {
      const cleanEmail = email?.trim().toLowerCase();

      if (!cleanEmail || !password) {
        return {
          statusCode: 400,
          body: {
            status: "error",
            message: "Email y password son requeridos",
          },
        };
      }

      const user = await userRepository.findByEmail(cleanEmail);
      if (!user) {
        return {
          statusCode: 401,
          body: {
            status: "error",
            message: "Credenciales invalidas",
          },
        };
      }

      const isPasswordValid = isValidPassword(password, user.password);
      if (!isPasswordValid) {
        return {
          statusCode: 401,
          body: {
            status: "error",
            message: "Credenciales invalidas",
          },
        };
      }

      const token = generateToken(user);

      return {
        statusCode: 200,
        body: {
          status: "success",
          message: "Login exitoso",
          token,
        },
      };
    } catch (error) {
      console.error("Error en login:", error.message);
      return {
        statusCode: 500,
        body: {
          status: "error",
          message: "Error interno del servidor",
        },
      };
    }
  }

  async forgotPassword({ email }) {
    const genericResponse = {
      status: "success",
      message: "Si el email existe, se enviará un enlace de recuperación",
    };

    try {
      const normalizedEmail = email?.trim().toLowerCase();

      if (!normalizedEmail) {
        return {
          statusCode: 400,
          body: {
            status: "error",
            message: "Email es requerido",
          },
        };
      }

      const user = await userRepository.findByEmail(normalizedEmail);

      if (!user) {
        return { statusCode: 200, body: genericResponse };
      }

      if (!process.env.RESET_PASSWORD_URL) {
        console.error("Falta RESET_PASSWORD_URL en .env");
        return { statusCode: 200, body: genericResponse };
      }

      const rawToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = hashResetToken(rawToken);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await userRepository.setResetToken(
        user._id || user.id,
        hashedToken,
        expiresAt,
      );

      const resetLink = `${process.env.RESET_PASSWORD_URL}?token=${encodeURIComponent(
        rawToken,
      )}`;

      try {
        await sendResetPasswordEmail({
          to: user.email,
          resetLink,
        });
      } catch (mailError) {
        console.error(
          "Error enviando mail de recuperación:",
          mailError.message,
        );
      }

      return { statusCode: 200, body: genericResponse };
    } catch (error) {
      console.error("Error en forgotPassword:", error.message);
      return { statusCode: 200, body: genericResponse };
    }
  }

  async resetPassword({ token, newPassword }) {
    try {
      const cleanToken = token?.trim();
      const cleanNewPassword = newPassword?.trim();

      if (!cleanToken || !cleanNewPassword) {
        return {
          statusCode: 400,
          body: {
            status: "error",
            message: "Token y nueva contraseña son requeridos",
          },
        };
      }

      if (cleanNewPassword.length < 8) {
        return {
          statusCode: 400,
          body: {
            status: "error",
            message: "La nueva contraseña debe tener al menos 8 caracteres",
          },
        };
      }

      const hashedToken = hashResetToken(cleanToken);
      const user = await userRepository.findByResetToken(hashedToken);

      if (!user) {
        return {
          statusCode: 400,
          body: {
            status: "error",
            message: "Token inválido o expirado",
          },
        };
      }

      const sameAsOldPassword = isValidPassword(
        cleanNewPassword,
        user.password,
      );
      if (sameAsOldPassword) {
        return {
          statusCode: 400,
          body: {
            status: "error",
            message: "La nueva contraseña no puede ser igual a la anterior",
          },
        };
      }

      const newHashedPassword = createHash(cleanNewPassword);

      await userRepository.updatePasswordAndClearReset(
        user._id || user.id,
        newHashedPassword,
      );

      return {
        statusCode: 200,
        body: {
          status: "success",
          message: "Contraseña actualizada correctamente",
        },
      };
    } catch (error) {
      console.error("Error en resetPassword:", error.message);
      return {
        statusCode: 500,
        body: {
          status: "error",
          message: "Error interno del servidor",
        },
      };
    }
  }
}

module.exports = new SessionService();
