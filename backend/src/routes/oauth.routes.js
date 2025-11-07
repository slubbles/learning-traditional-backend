// ========================================
// OAUTH AUTHENTICATION ROUTES
// ========================================
// Handles GitHub OAuth login flow

const express = require('express');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

/**
 * GITHUB OAUTH - INITIATE
 * GET /api/auth/github
 * Redirects user to GitHub for authentication
 */
router.get('/github', passport.authenticate('github', { session: false }));

/**
 * GITHUB OAUTH - CALLBACK
 * GET /api/auth/github/callback
 * GitHub redirects here after user authorizes
 */
router.get(
  '/github/callback',
  passport.authenticate('github', { 
    session: false,
    failureRedirect: process.env.FRONTEND_URL + '/login?error=oauth_failed'
  }),
  (req, res) => {
    try {
      // Generate JWT token for the authenticated user
      const token = jwt.sign(
        { userId: req.user.id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Redirect to frontend with token
      // Frontend will store the token and redirect to dashboard
      const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(process.env.FRONTEND_URL + '/login?error=oauth_error');
    }
  }
);

module.exports = router;
