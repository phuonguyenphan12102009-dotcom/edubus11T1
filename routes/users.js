const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const { getUsers, getUserBy, createUser, updateUser, deleteUser } = require('../db');

// GET /api/users
router.get('/users', (_req, res) => {
  const users = getUsers().map(({ password, ...u }) => u);
  res.json(users);
});

// POST /api/users — admin creates account
router.post('/users', async (req, res) => {
  try {
    const { username, password, name, role } = req.body;
    if (!username || !password || !name || !role)
      return res.status(400).json({ error: 'username, password, name and role are required' });

    const exists = getUserBy('username', username.toLowerCase().trim());
    if (exists) return res.status(409).json({ error: 'Username already taken' });

    const hashed = await bcrypt.hash(password, 10);
    const user   = createUser({ ...req.body, username: username.toLowerCase().trim(), password: hashed });
    const { password: _, ...safeUser } = user;
    return res.status(201).json(safeUser);
  } catch (err) {
    console.error('POST /users error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/users/:id
router.patch('/users/:id', (req, res) => {
  const { password, ...updates } = req.body;
  const user = updateUser(req.params.id, updates);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

// DELETE /api/users/:id
router.delete('/users/:id', (req, res) => {
  const ok = deleteUser(req.params.id);
  if (!ok) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true });
});

module.exports = router;
