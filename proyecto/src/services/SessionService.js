const crypto = require("crypto");
const { userRepository } = require("../repositories");
const { createHash, isValidPassword } = require("../utils/hash");
const { sendResetPasswordEmail } = require("../utils/mailer");

const hashResetToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

class SessionService {
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
        expiresAt
      );

      const resetLink = `${process.env.RESET_PASSWORD_URL}?token=${encodeURIComponent(
        rawToken
      )}`;

      try {
        await sendResetPasswordEmail({
          to: user.email,
          resetLink,
        });
      } catch (mailError) {
        console.error("Error enviando mail de recuperación:", mailError.message);
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

      const sameAsOldPassword = isValidPassword(cleanNewPassword, user.password);
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
        newHashedPassword
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
