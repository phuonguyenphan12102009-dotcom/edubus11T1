const router = require('express').Router();
const { getUsers, updateUser } = require('../db');

router.post('/scan', (req, res) => {
  const { studentId } = req.body;
  if (!studentId) return res.status(400).json({ error: 'studentId is required' });

  const users = getUsers();
  const user  = users.find(u => u._id === studentId || u.id === studentId);
  if (!user)           return res.status(404).json({ error: 'Student not found' });
  if (user.role !== 'student') return res.status(400).json({ error: 'User is not a student' });

  updateUser(user._id || user.id, { isBoarded: true });
  console.log(`✅ Scan: ${user.name} boarded at ${new Date().toISOString()}`);
  return res.json({ success: true, studentId, name: user.name, boardedAt: new Date().toISOString() });
});

router.post('/scan/reset', (req, res) => {
  const { busId } = req.body;
  const users = getUsers().filter(u => u.role === 'student' && (!busId || String(u.busId) === String(busId)));
  users.forEach(u => updateUser(u._id || u.id, { isBoarded: false }));
  res.json({ success: true, modifiedCount: users.length });
});

module.exports = router;
