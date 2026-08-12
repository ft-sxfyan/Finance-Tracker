// api/index.js
const app = require('../server'); // Import express app from server.js

// 1. Define routes FIRST
app.get('/', (req, res) => {
  res.send('Backend server is running successfully!');
});

// 2. Export app LAST
module.exports = app;
