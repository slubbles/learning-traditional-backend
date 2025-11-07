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
  (req, res, next) => {
    passport.authenticate('github', { session: false }, (err, user, info) => {
      if (err) {
        console.error('[OAuth Callback] Authentication error:', err);
        
        // Determine error type and redirect with specific message
        let errorMessage = 'oauth_failed';
        
        if (err.message?.includes('email')) {
          errorMessage = 'no_email_from_github';
        } else if (err.code === 'P2002') {
          errorMessage = 'email_already_exists';
        }
        
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=${errorMessage}`);
      }

      if (!user) {
        console.error('[OAuth Callback] No user returned');
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_no_user`);
      }

      try {
        // Generate JWT token for the authenticated user
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        console.log(`[OAuth Callback] Success! Redirecting user: ${user.email}`);
        
        // Redirect to frontend with token
        const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${token}`;
        res.redirect(redirectUrl);
      } catch (error) {
        console.error('[OAuth Callback] Token generation error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`);
      }
    })(req, res, next);
  }
);

module.exports = router;
