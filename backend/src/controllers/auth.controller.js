const authService = require('../services/auth.service');
const { AppError } = require('../utils/errors');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      
      res.json({
        status: 'success',
        message: 'Login exitoso',
        data: result
      });
    } catch (error) {
      next(new AppError(error.message, 401));
    }
  }

  async register(req, res, next) {
    try {
      const { email, name, password, role } = req.body;
      const user = await authService.createUser({ email, name, password, role });
      
      res.status(201).json({
        status: 'success',
        message: 'Usuario creado exitosamente',
        data: { user }
      });
    } catch (error) {
      next(new AppError(error.message, 400));
    }
  }

  async me(req, res) {
    res.json({
      status: 'success',
      data: {
        user: req.user
      }
    });
  }

  async logout(req, res) {
    // En JWT stateless, el logout es del lado del cliente
    res.json({
      status: 'success',
      message: 'Logout exitoso'
    });
  }
}

module.exports = new AuthController();