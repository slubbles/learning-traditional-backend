// ========================================
// PASSPORT.JS CONFIGURATION
// ========================================
// Handles OAuth authentication strategies

const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const prisma = require('./database');

/**
 * SERIALIZE USER
 * Stores user ID in session
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/**
 * DESERIALIZE USER
 * Retrieves user from database using session ID
 */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        provider: true
      }
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

/**
 * GITHUB OAUTH STRATEGY
 * Handles authentication via GitHub
 */
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:5000/api/auth/github/callback',
      scope: ['user:email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract user info from GitHub profile
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName || profile.username;
        const avatar = profile.photos?.[0]?.value;
        const githubId = profile.id;

        if (!email) {
          return done(new Error('No email found from GitHub profile'), null);
        }

        // Check if user already exists
        let user = await prisma.user.findUnique({
          where: { email }
        });

        if (user) {
          // User exists - update OAuth info if needed
          console.log(`[OAuth] Existing user found: ${email}, linking GitHub account`);
          
          if (!user.provider || !user.providerId) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                provider: 'github',
                providerId: githubId,
                avatar: avatar || user.avatar,
                emailVerified: true // OAuth users are auto-verified
              },
              select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
                provider: true
              }
            });
          }
          console.log(`[OAuth] User logged in successfully: ${email}`);
        } else {
          // New user - create account
          console.log(`[OAuth] Creating new user: ${email}`);
          user = await prisma.user.create({
            data: {
              email,
              name,
              avatar,
              provider: 'github',
              providerId: githubId,
              role: 'MEMBER',
              password: null, // OAuth users don't need password
              emailVerified: true // OAuth users are auto-verified
            },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              avatar: true,
              provider: true
            }
          });
        }

        return done(null, user);
      } catch (error) {
        console.error('[OAuth] Error during GitHub authentication:', error);
        console.error('[OAuth] Error details:', {
          message: error.message,
          code: error.code,
          email: profile?.emails?.[0]?.value
        });
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
