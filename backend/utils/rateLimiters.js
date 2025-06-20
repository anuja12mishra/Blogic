const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: 'Too many login attempts. Try again later.'
});

const userLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 100,
  message: 'Too many requests to user endpoint.'
});

const categoryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 200,
  message: 'Too many category requests.'
});

const blogLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
  message: 'Too many blog posts created in a short time.'
});

const commentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  message: 'Too many comments. Slow down!'
});

const likeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message: 'Too many likes per minute.'
});