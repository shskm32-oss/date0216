const express = require('express');
const { extractRole, preventClaudeDeletion } = require('./middleware/auth');
const itemsRouter = require('./routes/items');

const app = express();

app.use(express.json());
app.use(extractRole);
app.use(preventClaudeDeletion);

app.use('/items', itemsRouter);

module.exports = app;
