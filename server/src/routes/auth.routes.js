import { Router } from 'express';
import { register, login, logout, me, googleCallback } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import passport from '../passport.js';
import { config } from '../config.js';

const r = Router();
r.post('/register', register);
r.post('/login', login);
r.get('/me', requireAuth, me);
r.post('/logout', requireAuth, logout);

// Google OAuth routes - only if configured
if (config.google.clientID && config.google.clientID !== 'your-google-client-id-here') {
  r.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  }));

  r.get('/google/callback', 
    passport.authenticate('google', { 
      session: false,
      failureRedirect: '/login?error=oauth_failed' 
    }),
    googleCallback
  );
} else {
  // Return error if OAuth not configured
  r.get('/google', (req, res) => {
    res.status(503).json({ 
      message: 'Google OAuth is not configured. Please set up Google OAuth credentials in .env file.' 
    });
  });
}

export default r;
