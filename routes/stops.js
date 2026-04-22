const router = require('express').Router();
const { getStops, createStop, updateStop, deleteStop } = require('../db');

router.get('/stops', (_req, res) => res.json(getStops()));

router.post('/stops', (req, res) => {
  const stop = createStop(req.body);
  res.status(201).json(stop);
});

router.patch('/stops/:numericId', (req, res) => {
  const stop = updateStop(parseInt(req.params.numericId), req.body);
  if (!stop) return res.status(404).json({ error: 'Stop not found' });
  res.json(stop);
});

router.delete('/stops/:numericId', (req, res) => {
  const ok = deleteStop(parseInt(req.params.numericId));
  if (!ok) return res.status(404).json({ error: 'Stop not found' });
  res.json({ success: true });
});

module.exports = router;
