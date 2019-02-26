var port = process.env.PORT || 80;

const express = require('express');

const app = express();
app.use(express.static('static'));

app.listen(port, function() {
  console.log('App started');
});