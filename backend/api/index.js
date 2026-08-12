// api/index.js
const app = require('../server'); // Import your Express app instance

module.exports = app;
app.get('/', (req, res) => {
  res.send('Backend server is running successfully!');
});
