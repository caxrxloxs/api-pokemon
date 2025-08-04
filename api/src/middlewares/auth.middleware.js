import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { authConfig } from '../config/auth.js';

export const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    console.log('[Middleware] Verificando token para ruta:', req.path);
    try {
      console.log("midllle")
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) throw new Error('Token no proporcionado');

     
      const decoded = jwt.verify(token, authConfig.jwtSecret);
      const user = await User.findById(decoded.sub);
      
      if (!user) throw new Error('Usuario no encontrado');
      if (roles.length && !roles.includes(user.role)) {
        throw new Error('Acceso no autorizado para tu rol');
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ 
        success: false,
        message: error.message 
      });
    }
  };
};