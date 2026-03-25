import { Router } from 'express';
import { query } from '../config/db.js';
import jwt from 'jsonwebtoken';

const router = Router();

// Middleware de autenticación simple
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'No autenticado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Token inválido' });
  }
};

// GET /api/blog - Listar todos los posts
router.get('/', async (req, res) => {
  try {
    const posts = await query(`
      SELECT p.*, u.name as author_name 
      FROM BlogPosts p 
      JOIN Users u ON p.author_id = u.id 
      ORDER BY p.created_at DESC
    `);
    
    // Obtener comentarios para cada post
    for (let post of posts) {
      post.comments = await query(`
        SELECT c.*, u.name as user_name 
        FROM Comments c 
        JOIN Users u ON c.user_id = u.id 
        WHERE c.post_id = ?
        ORDER BY c.created_at ASC
      `, [post.id]);
    }

    res.json(posts);
  } catch (err) {
    console.error('Blog listing error:', err);
    res.status(500).json({ error: 'Error al obtener los posts' });
  }
});

// POST /api/blog - Crear un post
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, image1, image2 } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Título y contenido son requeridos' });
    }

    if (content.length > 4000) {
      return res.status(400).json({ error: 'El contenido supera los 4000 caracteres' });
    }

    await query(
      `INSERT INTO BlogPosts (title, content, author_id, image1, image2) VALUES (?, ?, ?, ?, ?)`,
      [title, content, req.user.id, image1 || null, image2 || null]
    );

    res.status(201).json({ message: 'Post creado exitosamente' });
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: 'Error al crear el post' });
  }
});

// POST /api/blog/:id/comments - Agregar un comentario
router.post('/:id/comments', authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.id;

    if (!content) {
      return res.status(400).json({ error: 'El contenido del comentario es requerido' });
    }

    await query(
      `INSERT INTO Comments (post_id, user_id, content) VALUES (?, ?, ?)`,
      [postId, req.user.id, content]
    );

    res.status(201).json({ message: 'Comentario agregado' });
  } catch (err) {
    console.error('Comment error:', err);
    res.status(500).json({ error: 'Error al agregar el comentario' });
  }
});

export default router;
