const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/data.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'data.json'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
