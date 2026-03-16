const CurrentUserDTO = require("../dto/users/CurrentUserDTO");
const sessionService = require("../services/SessionService");

class SessionController {
  //Controller para registrar un usuario
  async register(req, res) {
    try {
      const result = await sessionService.register(req.body || {});
      return res.status(result.statusCode).json(result.body);
    } catch (error) {
      console.error("Error en SessionController.register:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }
  //Controller para iniciar sesion
  async login(req, res) {
    try {
      const result = await sessionService.login(req.body || {});
      return res.status(result.statusCode).json(result.body);
    } catch (error) {
      console.error("Error en SessionController.login:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }

  current(req, res) {
    const currentUser = new CurrentUserDTO(req.user);
    return res.json({
      status: "success",
      payload: currentUser,
    });
  }
  //Controller para olvidar contraseña
  async forgotPassword(req, res) {
    try {
      const result = await sessionService.forgotPassword({
        email: req.body?.email,
      });
      return res.status(result.statusCode).json(result.body);
    } catch (error) {
      console.error(
        "Error en SessionController.forgotPassword:",
        error.message,
      );
      return res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }
  //Controller para resetear contraseña
  async resetPassword(req, res) {
    try {
      const result = await sessionService.resetPassword({
        token: req.body?.token,
        newPassword: req.body?.newPassword,
      });
      return res.status(result.statusCode).json(result.body);
    } catch (error) {
      console.error("Error en SessionController.resetPassword:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }
}

module.exports = new SessionController();
