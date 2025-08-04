import { AuthService } from '../services/auth.service.js';

export const AuthController = {
    
  async register(req, res) {
    try {
      await AuthService.register(req.body);
      res.status(201).json({
        success: true,
        message: "Usuario registrado exitosamente"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async login(req, res) {
    try {
      const result = await AuthService.login(req.body);
      if (!result) {
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas"
        });
      }
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error en el servidor"
      });
    }
  }
};