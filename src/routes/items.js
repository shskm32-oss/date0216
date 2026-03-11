const express = require('express');
const router = express.Router();

// In-memory store for demonstration purposes
const items = new Map([
  ['1', { id: '1', name: 'Item One' }],
  ['2', { id: '2', name: 'Item Two' }],
]);

router.get('/', (req, res) => {
  res.json(Array.from(items.values()));
});

router.get('/:id', (req, res) => {
  const item = items.get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not Found' });
  res.json(item);
});

router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const id = String(Date.now());
  const item = { id, name };
  items.set(id, item);
  res.status(201).json(item);
});

router.delete('/:id', (req, res) => {
  if (!items.has(req.params.id)) return res.status(404).json({ error: 'Not Found' });
  items.delete(req.params.id);
  res.status(204).send();
});

module.exports = router;
