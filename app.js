const express = require('express');
const app = express();
const complaintRoutes = require('./routes/complaintRoutes');
const path = require('path');
const cors = require('cors');

// Middleware
app.use(cors()); // CORS middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files (HTML, CSS, JS) from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Use complaint routes
app.use('/complaints', complaintRoutes);

// Serve the main HTML file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
