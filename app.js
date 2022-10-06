const express = require('express');
const auth = require('./auth');
const app = express();
const PORT = 8234;

// Middleware
app.use(express.json());
app.use('/auth', auth)


app.get('/dashboard', auth, (req, res, next) => {
  res.send('Welcome, ' + req.user[0].user_name)
})
// Endpoint Handler
app.use((req, res, next) => {
  const error = new Error('endpoint not found');
  error.status = 404;
  next(error);
});


// Error Handler
app.use((err, req ,res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message
  });
});


app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);
});