const express = require('express');
const app = express();

app.use(express.static('./dist/book-it'));
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: './dist/book-it'});
});

app.listen(process.env.PORT || 8080, () => console.log('Server running'));
