import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './config.js';
import { pool } from './db.js';

// Only configure Google OAuth if credentials are provided
if (config.google.clientID && config.google.clientID !== 'your-google-client-id-here') {
  // Configure Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Extract user info from Google profile
          const googleId = profile.id;
          const email = profile.emails[0].value;
          const name = profile.displayName;

          // Check if user exists with this Google ID
          let [users] = await pool.query(
            'SELECT * FROM users WHERE oauth_provider = ? AND oauth_id = ?',
            ['google', googleId]
          );

          let user = users[0];

          if (!user) {
            // Check if user exists with this email (link accounts)
            [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
            user = users[0];

            if (user) {
              // Link Google account to existing user
              await pool.query(
                'UPDATE users SET oauth_provider = ?, oauth_id = ? WHERE id = ?',
                ['google', googleId, user.id]
              );
            } else {
              // Create new user with Google OAuth
              const [result] = await pool.query(
                'INSERT INTO users (name, email, oauth_provider, oauth_id, role) VALUES (?, ?, ?, ?, ?)',
                [name, email, 'google', googleId, 'USER']
              );
              
              // Fetch the newly created user
              [users] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
              user = users[0];
            }
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
  console.log('✓ Google OAuth configured');
} else {
  console.log('⚠ Google OAuth not configured - add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env');
}

export default passport;
