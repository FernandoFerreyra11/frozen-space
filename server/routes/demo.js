import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

// POST /api/demo - Solicitar una demo
router.post('/', async (req, res) => {
  try {
    const { name, email, company, role } = req.body;

    // Validar campos requeridos
    if (!name || !email) {
      return res.status(400).json({ error: 'Nombre y email son requeridos' });
    }

    // Verificar si ya existe una solicitud con este email
    // Usamos una consulta para buscar el email exacto
    const existing = await query(`SELECT id FROM DemoRequests WHERE email = ?`, [email]);

    if (existing && existing.length > 0) {
      // Si ya existe, devolvemos el mensaje personalizado solicitado por el usuario
      return res.status(409).json({ 
        message: 'Ya recibimos una solicitud de demo con estos datos, te responderemos a la brevedad. Gracias',
        code: 'DUPLICATE_REQUEST'
      });
    }

    // Si no existe, insertar la nueva solicitud
    await query(
      `INSERT INTO DemoRequests (name, email, company, role) VALUES (?, ?, ?, ?)`,
      [name, email, company || null, role || null]
    );

    res.status(201).json({ 
      message: '¡Solicitud enviada! Te contactaremos pronto.' 
    });

  } catch (err) {
    console.error('Demo request error:', err);
    res.status(500).json({ error: 'Error interno del servidor al procesar la solicitud' });
  }
});

export default router;
