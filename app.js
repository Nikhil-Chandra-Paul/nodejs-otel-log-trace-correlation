// Import dependencies after env vars are loaded
const express = require('express');
const logger = require('./logger');
const app = express();

// Root endpoint
app.get('/', (req, res) => {
  logger.info('Handling / request');
  res.send('Hello, World!');
});

// Simulate async work
app.get('/work', async (req, res) => {
  logger.info('Starting async work');
  await new Promise(resolve => setTimeout(resolve, 300));
  logger.info('Async work complete');
  res.send('Work done!');
});


// Simulate DB call
app.get('/db', async (req, res) => {
  logger.info('Simulating DB query');
  await new Promise(resolve => setTimeout(resolve, 150));
  logger.info('DB query complete');
  res.send('DB result!');
});

// Error endpoint
app.get('/error', (req, res) => {
  logger.error('Something went wrong');
  res.status(500).send('Error');
});

app.listen(3000, () => {
  logger.info('Server started on port 3000');
});
