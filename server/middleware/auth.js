import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

export function authorizeAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Acceso denegado: Se requiere rol de administrador' });
  }
}

export async function authorizeOwnerOrAdmin(table, idParam = 'id', ownerField = 'author_id') {
  return async (req, res, next) => {
    const resourceId = req.params[idParam];
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole === 'admin') {
      return next();
    }

    try {
      const results = await query(`SELECT ${ownerField} FROM ${table} WHERE id = ?`, [resourceId]);
      if (results.length === 0) {
        return res.status(404).json({ error: 'Recurso no encontrado' });
      }

      if (results[0][ownerField] === userId) {
        next();
      } else {
        res.status(403).json({ error: 'No tienes permiso para modificar este recurso' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Error al verificar propiedad' });
    }
  };
}
