const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve input.html file
app.get('/input', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'input.html'));
});

// Optionally, your other routes here

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
