const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/users'));
app.use('/api', require('./routes/buses'));
app.use('/api', require('./routes/stops'));
app.use('/api', require('./routes/scan'));

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚌 EduBus API running on http://localhost:${PORT}`);
  console.log(`🌐 Mở trình duyệt vào: http://localhost:${PORT}`);
});
