const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { getUserBy } = require('../db');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: 'Username and password are required' });

    const user = getUserBy('username', username.toLowerCase().trim());
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const { password: _, ...safeUser } = user;
    return res.json({ user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
