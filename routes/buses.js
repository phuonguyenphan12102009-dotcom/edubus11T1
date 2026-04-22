const router = require('express').Router();
const { getBuses, createBus } = require('../db');

router.get('/buses', (_req, res) => res.json(getBuses()));

router.post('/buses', (req, res) => {
  const bus = createBus(req.body);
  res.status(201).json(bus);
});

module.exports = router;
