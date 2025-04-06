const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to Sanchari API!');
});

app.get('/users', (req, res) => {
  const users = [
    { id: 1, name: 'Arvind' },
    { id: 2, name: 'Balaji' },
  ];
  res.json(users);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
