import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { authConfig } from '../config/auth.js';


  export const authMiddleware = async (req, res, next) => {
    console.log('[Auth] Iniciando verificación de token');

    try {
      // Verifica que se envia un tocken
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        console.log('[Auth] No se proporcionó header Authorization');
        return res.status(401).json({ error: 'Token no proporcionado' });
      }
      // guarda token authHeader es transformado en un array de 2 elementos y se selecciona el segundo elemento(indice 1) partes = ['Bearer', 'eyJhbGciOiJIUzI1NiIsInR5cCI6...']
      const token = authHeader.split(' ')[1];
      if (!token) {
        console.log('[Auth] Formato de token inválido');
        return res.status(401).json({ error: 'Formato de token inválido' });
      }

      console.log('[Auth] Token recibido:', token);
      const decoded = jwt.verify(token, authConfig.jwtSecret);

      // Verificar si el usuario existe
      const user = await User.findById(decoded.sub);
      if (!user) {
        console.log('[Auth] Usuario no encontrado en BD');
        return res.status(401).json({ error: 'Usuario no autorizado' });
      }

      console.log('[Auth] Usuario autenticado:', user.username);
      req.user = user; // Adjuntar usuario completo al request
      next();
    } catch (error) {
      console.error('[Auth] Error:', error.message);

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado' });
      }

      return res.status(401).json({ error: 'Token inválido' });
    }
  };