import { Router } from 'express';
import { query } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// GET /api/challenges - List all challenges (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { technology, difficulty, category } = req.query;

    let sql = 'SELECT * FROM Challenges WHERE is_active = 1';
    const params = [];

    if (technology) {
      sql += ' AND technology = ?';
      params.push(technology);
    }
    if (difficulty) {
      sql += ' AND difficulty = ?';
      params.push(difficulty);
    }
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    sql += ' ORDER BY created_at DESC';

    const results = await query(sql, params);
    res.json({ challenges: results || [] });
  } catch (err) {
    console.error('Get challenges error:', err);
    res.status(500).json({ error: 'Error al obtener desafíos' });
  }
});

// GET /api/challenges/progress/me - Get user's progress (must be before /:id)
router.get('/progress/me', authenticateToken, async (req, res) => {
  try {
    const results = await query(
      `SELECT up.*, c.title_es, c.title_en, c.technology, c.difficulty
       FROM UserProgress up
       JOIN Challenges c ON up.challenge_id = c.id
       WHERE up.user_id = ?
       ORDER BY up.started_at DESC`,
      [req.user.id]
    );
    res.json({ progress: results || [] });
  } catch (err) {
    console.error('Get progress error:', err);
    res.status(500).json({ error: 'Error al obtener progreso' });
  }
});

// GET /api/challenges/:id - Get single challenge
router.get('/:id', async (req, res) => {
  try {
    const results = await query(
      'SELECT * FROM Challenges WHERE id = ? AND is_active = 1',
      [parseInt(req.params.id)]
    );

    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'Desafío no encontrado' });
    }

    res.json({ challenge: results[0] });
  } catch (err) {
    console.error('Get challenge error:', err);
    res.status(500).json({ error: 'Error al obtener el desafío' });
  }
});

// POST /api/challenges/:id/progress - Update user progress on a challenge
router.post('/:id/progress', authenticateToken, async (req, res) => {
  try {
    const { status, score } = req.body;
    const challengeId = parseInt(req.params.id);
    const userId = req.user.id;

    // Check if progress record exists
    const existing = await query(
      'SELECT id FROM UserProgress WHERE user_id = ? AND challenge_id = ?',
      [userId, challengeId]
    );

    if (existing && existing.length > 0) {
      // Update existing
      const completedClause = status === 'completed' ? ', completed_at = GETDATE()' : '';
      await query(
        `UPDATE UserProgress SET status = ?, score = ?${completedClause} WHERE user_id = ? AND challenge_id = ?`,
        [status, score || 0, userId, challengeId]
      );
    } else {
      // Insert new
      await query(
        'INSERT INTO UserProgress (user_id, challenge_id, status, score) VALUES (?, ?, ?, ?)',
        [userId, challengeId, status || 'in_progress', score || 0]
      );
    }

    res.json({ message: 'Progreso actualizado' });
  } catch (err) {
    console.error('Update progress error:', err);
    res.status(500).json({ error: 'Error al actualizar progreso' });
  }
});

export default router;
